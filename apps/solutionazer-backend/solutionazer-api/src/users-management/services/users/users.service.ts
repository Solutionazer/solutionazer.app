/**
 * This file is part of solutionazer.app.
 *
 * solutionazer.app is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License only.
 *
 * solutionazer.app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with solutionazer.app. If not, see <https://www.gnu.org/licenses/gpl-3.0.en.html>.
 *
 * Copyright (C) 2025 David Llamas Román
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../dtos/users.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(uuid: string) {
    const user: User | null = await this.userRepository.findOne({
      where: { uuid },
    });

    if (!user) {
      throw new NotFoundException(`User = { uuid: ${uuid} } not found`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user: User | null = await this.userRepository.findOne({
      select: ['uuid', 'email', 'fullName', 'password'],
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User = { email: ${email} } not found`);
    }

    return user;
  }

  async checkEmail(email: string) {
    const user: User = await this.findOneByEmail(email);

    return user || true;
  }

  async findOneByUuidWithRoles(uuid: string) {
    const user: User | null = await this.userRepository.findOne({
      where: { uuid },
      relations: {
        roles: { permissions: true },
        companyRoles: { role: { permissions: true }, company: true },
        teamRoles: { role: { permissions: true }, team: true },
      },
    });

    if (!user) {
      throw new NotFoundException(`User = { uuid ${uuid} } not found`);
    }

    return user;
  }

  async validatePassword(user: User, plain: string) {
    return await bcrypt.compare(plain, user.password);
  }

  buildTokenPayload(user: User) {
    return {
      sub: user.uuid,
      roles: {
        global:
          user.roles.map((role) => ({
            name: role.name,
            permissions: role.permissions.map((permission) => permission.name),
          })) ?? [],
        company:
          user.companyRoles.map((companyRole) => ({
            companyUuid: companyRole.company.uuid,
            role: {
              name: companyRole.role.name,
              permissions: companyRole.role.permissions.map(
                (permission) => permission.name,
              ),
            },
          })) ?? [],
        team:
          user.teamRoles.map((teamRole) => ({
            teamUuid: teamRole.team.uuid,
            role: {
              name: teamRole.role.name,
              permissions: teamRole.role.permissions.map(
                (permission) => permission.name,
              ),
            },
          })) ?? [],
      },
    };
  }

  async create(data: CreateUserDto) {
    const newUser: User = this.userRepository.create(data);

    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    newUser.roles = newUser.roles ?? [];
    newUser.roles.push(await this.rolesService.findOneByName('Individual'));

    return this.userRepository.save(newUser);
  }

  async update(uuid: string, changes: UpdateUserDto) {
    const user: User = await this.findOne(uuid);

    this.userRepository.merge(user, changes);
    return this.userRepository.save(user);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.userRepository.delete(uuid);
  }
}
