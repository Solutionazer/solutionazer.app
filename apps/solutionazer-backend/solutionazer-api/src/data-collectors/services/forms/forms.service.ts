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
import { DataCollector } from 'src/data-collectors/entities/data-collector.entity';
import DataCollectorType from 'src/data-collectors/enums/data-collector-type.enum';
import { UsersService } from 'src/users-management/services/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(DataCollector)
    private readonly dataCollectorRepository: Repository<DataCollector>,
    private readonly usersService: UsersService,
  ) {}

  findAllByUserUuid(uuid: string) {
    return this.dataCollectorRepository.find({
      where: { user: { uuid }, type: DataCollectorType.Form },
    });
  }

  async findOne(uuid: string) {
    const form: DataCollector | null =
      await this.dataCollectorRepository.findOne({
        where: { uuid },
      });

    if (!form) {
      throw new NotFoundException(`Form = { uuid: ${uuid} } not found`);
    }

    return form;
  }

  async create(data: CreateDataCollectorDto) {
    await this.usersService.findOne(data.user.uuid);

    const { title, description, user } = data;

    const newForm: DataCollector = this.dataCollectorRepository.create({
      title,
      description,
      type: DataCollectorType.Form,
      user,
    });

    return this.dataCollectorRepository.save(newForm);
  }

  async update(uuid: string, changes: UpdateDataCollectorDto) {
    const form: DataCollector = await this.findOne(uuid);

    this.dataCollectorRepository.merge(form, changes);
    return this.dataCollectorRepository.save(form);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.dataCollectorRepository.delete(uuid);
  }
}
