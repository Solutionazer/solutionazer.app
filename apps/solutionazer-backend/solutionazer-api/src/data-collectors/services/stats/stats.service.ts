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
  CreateStatsDto,
  UpdateStatsDto,
} from 'src/data-collectors/dtos/stats.dtos';
import { Stats } from 'src/data-collectors/entities/stats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}

  async findOne(uuid: string) {
    const stats: Stats | null = await this.statsRepository.findOne({
      where: {
        dataCollector: { uuid },
      },
      relations: ['dataCollector'],
    });

    if (!stats) {
      throw new NotFoundException(`Stats = { uuid: ${uuid} } not found`);
    }

    return stats;
  }

  create(data: CreateStatsDto) {
    const newStats: Stats = this.statsRepository.create(data);
    return this.statsRepository.save(newStats);
  }

  async update(uuid: string, changes: UpdateStatsDto) {
    const stats = await this.statsRepository.findOne({
      where: { uuid },
    });

    if (!stats) {
      throw new NotFoundException(`Stats = { uuid: ${uuid} } not found`);
    }

    this.statsRepository.merge(stats, changes);
    return this.statsRepository.save(stats);
  }

  async remove(uuid: string) {
    const stats = await this.statsRepository.findOne({
      where: { uuid },
    });

    if (!stats) {
      throw new NotFoundException(`Stats = { uuid: ${uuid} } not found`);
    }

    return this.statsRepository.delete(uuid);
  }
}
