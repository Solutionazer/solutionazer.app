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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
} from 'src/users-management/dtos/companies.dtos';
import { Company } from 'src/users-management/entities/company.entity';
import { UsersService } from '../users/users.service';
import { User } from 'src/users-management/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    const companies: Company[] | null = await this.companyRepository.find({
      relations: ['admins'],
    });

    return companies.map(({ uuid, companyName, logInEmail, admins }) => ({
      uuid,
      companyName,
      logInEmail,
      admins,
    }));
  }

  async findOne(uuid: string) {
    const company: Company | null = await this.companyRepository.findOne({
      where: { uuid },
      relations: ['admins'],
    });

    if (!company) {
      throw new NotFoundException(`Company = { uuid: ${uuid} } not found`);
    }

    const { uuid: companyUuid, companyName, logInEmail, admins } = company;

    return {
      uuid: companyUuid,
      companyName,
      logInEmail,
      admins,
    } as Company;
  }

  async findOneByLoginEmail(email: string) {
    const company: Company | null = await this.companyRepository.findOne({
      where: { logInEmail: email },
    });

    if (!company) {
      throw new NotFoundException(`Company = { email: ${email} } not found`);
    }

    const { uuid: companyUuid, companyName, logInEmail, admins } = company;

    return {
      uuid: companyUuid,
      companyName,
      logInEmail,
      admins,
    };
  }

  async create(data: CreateCompanyDto) {
    (
      await Promise.all(
        data.admins.map(async (admin) => {
          const user: User = await this.usersService.findOne(admin.uuid);
          return !!user;
        }),
      )
    ).every(Boolean);

    const newCompany: Company = this.companyRepository.create(data);
    return this.companyRepository.save(newCompany);
  }

  async update(uuid: string, changes: UpdateCompanyDto) {
    const company: Company = await this.findOne(uuid);

    (
      await Promise.all(
        changes.admins?.map(async (admin) => {
          const user: User = await this.usersService.findOne(admin.uuid);
          return !!user;
        }) ?? [],
      )
    ).every(Boolean);

    this.companyRepository.merge(company, changes);
    return this.companyRepository.save(company);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.companyRepository.delete(uuid);
  }
}
