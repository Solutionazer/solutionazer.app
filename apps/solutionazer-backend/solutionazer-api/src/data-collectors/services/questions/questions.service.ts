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
  CreateQuestionDto,
  UpdateQuestionDto,
} from 'src/data-collectors/dtos/questions.dtos';
import { Question } from 'src/data-collectors/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  findAllByFormUuid(uuid: string) {}

  findAllBySurveyUuid(uuid: string) {}

  async findOne(uuid: string) {
    const question: Question | null = await this.questionRepository.findOne({
      where: { uuid },
    });

    if (!question) {
      throw new NotFoundException(`Question = { uuid: ${uuid} } not found`);
    }

    return question;
  }

  create(data: CreateQuestionDto) {
    const newQuestion: Question = this.questionRepository.create(data);
    return this.questionRepository.save(newQuestion);
  }

  async update(uuid: string, changes: UpdateQuestionDto) {
    const question: Question = await this.findOne(uuid);

    this.questionRepository.merge(question, changes);
    return this.questionRepository.save(question);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.questionRepository.delete(uuid);
  }
}
