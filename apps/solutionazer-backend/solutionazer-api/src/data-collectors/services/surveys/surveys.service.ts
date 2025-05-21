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
  CreateDataCollectorDto,
  UpdateDataCollectorDto,
} from 'src/data-collectors/dtos/data-collectors.dtos';
import { CreateStatsDto } from 'src/data-collectors/dtos/stats.dtos';
import { DataCollector } from 'src/data-collectors/entities/data-collector.entity';
import { Stats } from 'src/data-collectors/entities/stats.entity';
import DataCollectorType from 'src/data-collectors/enums/data-collector-type.enum';
import { User } from 'src/users-management/entities/user.entity';
import { UsersService } from 'src/users-management/services/users/users.service';
import { FindOneOptions, Repository } from 'typeorm';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(DataCollector)
    private readonly dataCollectorRepository: Repository<DataCollector>,
    private readonly usersService: UsersService,
    private readonly statsService: StatsService,
  ) {}

  async findPublicSurvey(uuid: string) {
    const survey: DataCollector = await this.findOne(uuid, {
      relations: ['questions', 'questions.type'],
    });

    const { title, description, type, isPublished, questions } = survey;

    return {
      title,
      description,
      type,
      isPublished,
      questions,
    };
  }

  async publish(uuid: string) {
    const survey: DataCollector = await this.findOne(uuid, {
      relations: ['questions', 'questions.type'],
    });

    survey.isPublished = true;

    return this.dataCollectorRepository.save(survey);
  }

  findAllByUserUuid(uuid: string) {
    return this.dataCollectorRepository.find({
      where: { user: { uuid }, type: DataCollectorType.Survey },
    });
  }

  async findOne(uuid: string, options?: FindOneOptions<DataCollector>) {
    const survey: DataCollector | null =
      await this.dataCollectorRepository.findOne({
        where: { uuid, type: DataCollectorType.Survey },
        ...options,
      });

    if (!survey) {
      throw new NotFoundException(`Survey = { uuid: ${uuid} } not found`);
    }

    return survey;
  }

  async create(data: CreateDataCollectorDto) {
    const { title, description, userUuid } = data;
    const user: User = await this.usersService.findOne(userUuid);

    const stats: Stats = await this.statsService.create({} as CreateStatsDto);

    const newSurvey: DataCollector = this.dataCollectorRepository.create({
      title,
      description,
      type: DataCollectorType.Survey,
      user,
      stats,
    });

    return this.dataCollectorRepository.save(newSurvey);
  }

  async update(uuid: string, changes: UpdateDataCollectorDto) {
    const survey: DataCollector = await this.findOne(uuid);

    this.dataCollectorRepository.merge(survey, changes);
    return this.dataCollectorRepository.save(survey);
  }

  async remove(uuid: string) {
    const survey: DataCollector = await this.findOne(uuid, {
      relations: ['stats'],
    });

    await this.statsService.remove(survey.stats.uuid);

    return this.dataCollectorRepository.delete(uuid);
  }
}
