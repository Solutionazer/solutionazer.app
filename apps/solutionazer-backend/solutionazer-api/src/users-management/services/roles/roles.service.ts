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

import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRoleDto,
  UpdateRoleDto,
} from 'src/users-management/dtos/roles.dtos';
import { UsersService } from '../users/users.service';
import { User } from 'src/users-management/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findAllByUserUuid(uuid: string) {
    const user: User = await this.usersService.findOne(uuid);
    return user.roles;
  }

  async findAllByCompanyUuid(uuid: string) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.companyUserRoles', 'companyUserRole')
      .innerJoin('companyUserRole.company', 'company')
      .where('company.uuid = :uuid', { uuid })
      .getMany();
  }

  async findAllByTeamUuid(uuid: string) {
    return await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.teamUserRoles', 'teamUserRole')
      .innerJoin('companyUserRole.company', 'company')
      .where('company.uuid = :uuid', { uuid })
      .getMany();
  }

  async findOne(uuid: string) {
    const role: Role | null = await this.roleRepository.findOne({
      where: { uuid },
    });

    if (!role) {
      throw new NotFoundException(`Role = { uuid: ${uuid} } not found`);
    }

    return role;
  }

  async findOneByName(name: string) {
    const role: Role | null = await this.roleRepository.findOne({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException(`Role = { name: ${name} } not found`);
    }

    return role;
  }

  create(data: CreateRoleDto) {
    const newRole: Role = this.roleRepository.create(data);
    return this.roleRepository.save(newRole);
  }

  async update(uuid: string, changes: UpdateRoleDto) {
    const role: Role = await this.findOne(uuid);

    this.roleRepository.merge(role, changes);
    return this.roleRepository.save(role);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.roleRepository.delete(uuid);
  }
}
