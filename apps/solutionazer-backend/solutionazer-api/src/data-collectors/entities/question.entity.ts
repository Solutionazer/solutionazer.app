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
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataCollector } from './data-collector.entity';
import { Transition } from './transition.entity';
import { Exclude } from 'class-transformer';
import { QuestionType } from './question-type.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'boolean', nullable: false })
  required: boolean;

  @Column({ type: 'int', nullable: false })
  order: number;

  // forms / surveys
  @ManyToOne(() => DataCollector, (dataCollector) => dataCollector.questions, {
    nullable: true,
  })
  @JoinColumn({ name: 'dataCollectorUuid' })
  dataCollector: DataCollector;

  // questions
  @ManyToOne(() => QuestionType, { nullable: false })
  @JoinColumn({ name: 'questionTypeUuid' })
  type: QuestionType;

  // transition
  @ManyToOne(() => Transition, (transition) => transition.question, {
    nullable: true,
  })
  @JoinColumn({ name: 'transitionUuid' })
  transition: Transition;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
