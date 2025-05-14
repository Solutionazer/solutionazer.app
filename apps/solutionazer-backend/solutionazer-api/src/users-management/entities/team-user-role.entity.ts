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

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';
import { Role } from './role.entity';

@Entity()
export class TeamUserRole {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Team, (team) => team.userRoles)
  @JoinColumn({ name: 'teamUuid' })
  team: Team;

  @ManyToOne(() => User, (user) => user.teamRoles)
  @JoinColumn({ name: 'userUuid' })
  user: User;

  @ManyToOne(() => Role, (role) => role.teamUserRoles)
  @JoinColumn({ name: 'roleUuid' })
  role: Role;
}
