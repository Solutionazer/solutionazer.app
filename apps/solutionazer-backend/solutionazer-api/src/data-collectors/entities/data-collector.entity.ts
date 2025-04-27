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

import { Exclude } from 'class-transformer';
import { User } from '../../users-management/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Stats } from './stats.entity';
import DataCollectorType from '../enums/data-collector-type.enum';

@Entity()
export class DataCollector {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'enum', enum: DataCollectorType, nullable: false })
  type: DataCollectorType;

  // owner
  @ManyToOne(() => User, (user) => user.dataCollectors, { nullable: false })
  @JoinColumn({ name: 'userUuid' })
  user: User;

  // questions
  @OneToMany(() => Question, (question) => question.dataCollector, {
    nullable: true,
  })
  questions: Question[];

  // stats
  @OneToOne(() => Stats, { nullable: true })
  @JoinColumn({ name: 'statsUuid' })
  stats: Stats;

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
