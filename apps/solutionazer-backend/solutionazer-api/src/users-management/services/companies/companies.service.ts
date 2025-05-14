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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
} from 'src/users-management/dtos/companies.dtos';
import { Company } from 'src/users-management/entities/company.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/users-management/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { Role } from 'src/users-management/entities/role.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async findAll() {
    const companies: Company[] | null = await this.companyRepository.find({
      relations: ['admins', 'members'],
    });

    return companies.map(({ uuid, name, admins, members }) => ({
      uuid,
      name,
      admins,
      members,
    }));
  }

  async findAllByUserUuid(uuid: string) {
    return await this.companyRepository.find({
      where: { admins: { uuid } },
      relations: ['admins', 'members'],
    });
  }

  async findOne(uuid: string) {
    const company: Company | null = await this.companyRepository.findOne({
      where: { uuid },
      relations: ['admins', 'members'],
    });

    if (!company) {
      throw new NotFoundException(`Company = { uuid: ${uuid} } not found`);
    }

    const { uuid: companyUuid, name, admins, members } = company;

    return {
      uuid: companyUuid,
      name,
      admins,
      members,
    } as Company;
  }

  async checkUserUuid(uuid: string) {
    const companies: Company[] = await this.findAllByUserUuid(uuid);

    return companies.some((company) =>
      company.admins.some((admin) => admin.uuid === uuid),
    );
  }

  async create(data: CreateCompanyDto) {
    let users: User[] = [];

    if (data.admins?.length) {
      users = await Promise.all(
        data.admins.map(async (admin) => {
          const user: User = await this.usersService.findOne(admin.uuid, {
            relations: ['roles'],
          });

          const role: Role =
            await this.rolesService.findOneByName('Company Admin');

          if (
            !user.roles.find((existingRole) => existingRole.uuid === role.uuid)
          ) {
            user.roles.push(role);

            await this.userRepository.save(user);
          }

          return user;
        }),
      );
    }

    const newCompany: Company = this.companyRepository.create(data);

    newCompany.admins = users;

    return this.companyRepository.save(newCompany);
  }

  async update(uuid: string, changes: UpdateCompanyDto) {
    const company: Company = await this.findOne(uuid);
    let users: User[] = [];

    if (changes.admins?.length) {
      users = await Promise.all(
        changes.admins.map(async (admin) => {
          const user: User = await this.usersService.findOne(admin.uuid);
          return user;
        }),
      );

      company.admins = users;
    }

    if (changes.members?.length) {
      const membersUsers = await Promise.all(
        changes.members.map((member: any) =>
          this.usersService.findOne(member.uuid),
        ),
      );

      company.members = membersUsers;
    }

    const updatedCompany: Company = this.companyRepository.merge(
      company,
      changes,
    );

    await this.companyRepository.save(updatedCompany);

    return {
      uuid: updatedCompany.uuid,
      name: updatedCompany.name,
      admins: updatedCompany.admins,
      members: updatedCompany.members,
    };
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.companyRepository.delete(uuid);
  }
}
