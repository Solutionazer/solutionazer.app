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
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Team } from './team.entity';
import { Company } from './company.entity';
import { CompanyUserRole } from './company-user-role.entity';
import { TeamUserRole } from './team-user-role.entity';
import { Exclude } from 'class-transformer';
import { DataCollector } from '../../data-collectors/entities/data-collector.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  // global roles
  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  // companies where user be as admin
  @ManyToMany(() => Company, (company) => company.admins)
  companiesAsAdmin: Company[];

  // companies where user be as member
  @ManyToMany(() => Company, (company) => company.members)
  companiesAsMember: Company[];

  // company roles
  @OneToMany(() => CompanyUserRole, (companyUserRole) => companyUserRole.user)
  companyRoles: CompanyUserRole[];

  // teams where user be
  @ManyToMany(() => Team, (team) => team.members)
  @JoinTable({ name: 'user_teams' })
  teams: Team[];

  // team roles
  @OneToMany(() => TeamUserRole, (teamUserRole) => teamUserRole.user)
  teamRoles: TeamUserRole[];

  // forms / surveys
  @OneToMany(() => DataCollector, (dataCollector) => dataCollector.user)
  dataCollectors: DataCollector[];

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
