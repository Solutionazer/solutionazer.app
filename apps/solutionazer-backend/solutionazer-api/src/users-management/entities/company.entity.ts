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
import { User } from './user.entity';
import { CompanyUserRole } from './company-user-role.entity';
import { Team } from './team.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  companyName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  logInEmail: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  logInPassword: string;

  // admins
  @ManyToMany(() => User)
  @JoinTable({ name: 'company_admins' })
  admins: User[];

  // user roles into company
  @OneToMany(
    () => CompanyUserRole,
    (companyUserRole) => companyUserRole.company,
  )
  userRoles: CompanyUserRole[];

  // company teams
  @OneToMany(() => Team, (team) => team.company)
  teams: Team[];

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
