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
  CreateTransitionDto,
  UpdateTransitionDto,
} from 'src/data-collectors/dtos/transitions.dtos';
import { Transition } from 'src/data-collectors/entities/transition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransitionsService {
  constructor(
    @InjectRepository(Transition)
    private readonly transitionRepository: Repository<Transition>,
  ) {}

  findAll() {
    return this.transitionRepository.find();
  }

  async findOne(uuid: string) {
    const transition: Transition | null =
      await this.transitionRepository.findOne({
        where: { uuid },
      });

    if (!transition) {
      throw new NotFoundException(`Transition = { uuid: ${uuid} } not found`);
    }

    return transition;
  }

  create(data: CreateTransitionDto) {
    const newTransition: Transition = this.transitionRepository.create(data);
    return this.transitionRepository.save(newTransition);
  }

  async update(uuid: string, changes: UpdateTransitionDto) {
    const transition: Transition = await this.findOne(uuid);

    this.transitionRepository.merge(transition, changes);
    return this.transitionRepository.save(transition);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.transitionRepository.delete(uuid);
  }
}
