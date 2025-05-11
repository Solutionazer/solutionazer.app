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
import {
  CreateTeamDto,
  UpdateTeamDto,
} from 'src/users-management/dtos/teams.dtos';
import { Team } from 'src/users-management/entities/team.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { User } from 'src/users-management/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  async findAllByUserUuid(uuid: string) {
    const user: User = await this.usersService.findOne(uuid, {
      relations: ['teams'],
    });

    const teams: Team[] = user.teams;

    return teams.map((team) => {
      const isOwner: boolean = team.owner.uuid === user.uuid;
      const isCompanyTeam: boolean = !!team.company;
      const isUserInCompanyAsMember: boolean = user.companiesAsMember.some(
        (company) => company.uuid === team.company.uuid,
      );
      const isUserInCompanyAsAdmin: boolean = user.companiesAsAdmin.some(
        (company) => company.uuid === team.company.uuid,
      );

      let type: 'freelance-own' | 'company-own' | 'external';

      if (isOwner && !isCompanyTeam) {
        type = 'freelance-own';
      } else if (
        isCompanyTeam &&
        (isUserInCompanyAsMember || isUserInCompanyAsAdmin)
      ) {
        type = 'company-own';
      } else {
        type = 'external';
      }

      const { uuid, name, owner, members } = team;
      return {
        uuid,
        owner,
        name,
        members,
        type,
      };
    });
  }

  async findAllByCompanyUuid(uuid: string) {
    await this.companiesService.findOne(uuid);

    const teams: Team[] = await this.teamRepository.find({
      where: { company: { uuid } },
    });

    return teams.map((team) => {
      const { uuid, name, company, members } = team;
      return {
        uuid,
        company,
        name,
        members,
      };
    });
  }

  async findOne(uuid: string) {
    const team: Team | null = await this.teamRepository.findOne({
      where: { uuid },
    });

    if (!team) {
      throw new NotFoundException(`Team = { uuid: ${uuid} } not found`);
    }

    return team;
  }

  async create(data: CreateTeamDto) {
    const { owner: ownerUuid, ...rest } = data;

    let owner: User | undefined;
    if (ownerUuid) {
      owner = await this.usersService.findOne(ownerUuid);
    }

    const newTeam: Team = this.teamRepository.create({
      ...rest,
      owner,
    });
    return this.teamRepository.save(newTeam);
  }

  async update(uuid: string, changes: UpdateTeamDto) {
    const team: Team = await this.findOne(uuid);

    let updatedOwner: User | undefined;
    if (changes.owner) {
      updatedOwner = await this.usersService.findOne(changes.owner);
    }

    const updatedTeam = this.teamRepository.merge(team, {
      ...changes,
      owner: updatedOwner ?? team.owner,
    });

    return this.teamRepository.save(updatedTeam);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.teamRepository.delete(uuid);
  }
}
