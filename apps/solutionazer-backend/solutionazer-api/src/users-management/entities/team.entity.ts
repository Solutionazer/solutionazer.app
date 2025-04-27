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
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamUserRole } from './team-user-role.entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  // team owner
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerUuid' })
  owner: User;

  // company where the team belongs to
  @ManyToOne(() => Company, (company) => company.teams, { nullable: true })
  @JoinColumn({ name: 'companyUuid' })
  company: Company;

  // team members
  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({ name: 'team_members' })
  members: User[];

  // user roles into team
  @OneToMany(() => TeamUserRole, (teamUserRole) => teamUserRole.team)
  userRoles: TeamUserRole[];

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
