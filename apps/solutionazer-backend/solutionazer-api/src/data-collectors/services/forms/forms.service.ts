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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateDataCollectorDto,
  UpdateDataCollectorDto,
} from 'src/data-collectors/dtos/data-collectors.dtos';
import { DataCollector } from 'src/data-collectors/entities/data-collector.entity';
import DataCollectorType from 'src/data-collectors/enums/data-collector-type.enum';
import { User } from 'src/users-management/entities/user.entity';
import { UsersService } from 'src/users-management/services/users/users.service';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { StatsService } from '../stats/stats.service';
import { Stats } from 'src/data-collectors/entities/stats.entity';
import { CreateStatsDto } from 'src/data-collectors/dtos/stats.dtos';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(DataCollector)
    private readonly dataCollectorRepository: Repository<DataCollector>,
    private readonly usersService: UsersService,
    private readonly statsService: StatsService,
    private readonly dataSource: DataSource,
  ) {}

  async findPublicForm(uuid: string) {
    const form: DataCollector = await this.findOne(uuid, {
      relations: ['questions', 'questions.type'],
    });

    const { title, description, type, isPublished, questions } = form;

    return {
      title,
      description,
      type,
      isPublished,
      questions,
    };
  }

  async publish(uuid: string) {
    const form: DataCollector = await this.findOne(uuid, {
      relations: ['questions', 'questions.type'],
    });

    form.isPublished = true;

    return this.dataCollectorRepository.save(form);
  }

  findAllByUserUuid(uuid: string) {
    return this.dataCollectorRepository.find({
      where: { user: { uuid }, type: DataCollectorType.Form },
    });
  }

  async findOne(uuid: string, options?: FindOneOptions<DataCollector>) {
    const form: DataCollector | null =
      await this.dataCollectorRepository.findOne({
        where: { uuid, type: DataCollectorType.Form },
        ...options,
      });

    if (!form) {
      throw new NotFoundException(`Form = { uuid: ${uuid} } not found`);
    }

    return form;
  }

  async cloneAndAssignToUser(originalFormUuid: string, targetUserUuid: string) {
    const originalForm: DataCollector = await this.findOne(originalFormUuid, {
      relations: ['questions', 'questions.type', 'stats'],
    });

    if (originalForm.type !== DataCollectorType.Form) {
      throw new Error('Only forms can be cloned.');
    }

    const user: User = await this.usersService.findOne(targetUserUuid);

    const newStats: Stats = await this.statsService.create(
      {} as CreateStatsDto,
    );

    const clonedForm = this.dataCollectorRepository.create({
      title: originalForm.title,
      description: originalForm.description,
      type: DataCollectorType.Form,
      user,
      stats: newStats,
      isPublished: false,
      clonedFrom: originalForm,
      questions: originalForm.questions.map((question) => ({
        ...question,
      })),
    });

    return this.dataCollectorRepository.save(clonedForm);
  }

  async undoClone(clonedFormUuid: string) {
    const clonedForm = await this.dataCollectorRepository.findOne({
      where: { uuid: clonedFormUuid, type: DataCollectorType.Form },
      relations: ['stats'],
    });

    if (!clonedForm) {
      throw new NotFoundException(
        `Cloned form with uuid ${clonedFormUuid} not found`,
      );
    }

    if (clonedForm.stats) {
      await this.statsService.remove(clonedForm.stats.uuid);
    }

    await this.dataCollectorRepository.delete(clonedFormUuid);
  }

  async findAllClonesRecursively(formUuid: string) {
    const results = await this.dataSource.query(
      `
      WITH RECURSIVE clones AS (
      SELECT * FROM data_collector
      WHERE "clonedFromUuid" = $1 AND type = 'form'
      UNION ALL
      SELECT dc.* FROM data_collector dc
      INNER JOIN clones c ON dc."clonedFromUuid" = c.uuid
      WHERE dc.type = 'form'
    )
    SELECT
      dc.uuid as "clonedFormUuid",
      u.uuid as "userUuid",
      u."fullName",
      u.email
    FROM clones dc
    JOIN public."user" u ON u.uuid = dc."userUuid"
      `,
      [formUuid],
    );

    return results.map((row) => ({
      clonedFormUuid: row.clonedFormUuid,
      member: {
        uuid: row.userUuid,
        fullName: row.fullName,
        email: row.email,
      },
    }));
  }

  async create(data: CreateDataCollectorDto) {
    const { title, description, userUuid } = data;
    const user: User = await this.usersService.findOne(userUuid);

    const stats: Stats = await this.statsService.create({} as CreateStatsDto);

    const newForm: DataCollector = this.dataCollectorRepository.create({
      title,
      description,
      type: DataCollectorType.Form,
      user,
      stats,
    });

    return this.dataCollectorRepository.save(newForm);
  }

  async update(uuid: string, changes: UpdateDataCollectorDto) {
    const form: DataCollector = await this.findOne(uuid);

    this.dataCollectorRepository.merge(form, changes);
    return this.dataCollectorRepository.save(form);
  }

  async remove(uuid: string) {
    const form: DataCollector = await this.findOne(uuid, {
      relations: ['stats'],
    });

    await this.statsService.remove(form.stats.uuid);

    return this.dataCollectorRepository.delete(uuid);
  }
}
