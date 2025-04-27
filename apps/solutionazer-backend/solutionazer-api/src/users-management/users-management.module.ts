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

import { forwardRef, Module } from '@nestjs/common';

import { UsersController } from './controllers/users/users.controller';
import { RolesController } from './controllers/roles/roles.controller';
import { PermissionsController } from './controllers/permissions/permissions.controller';
import { UsersService } from './services/users/users.service';
import { RolesService } from './services/roles/roles.service';
import { PermissionsService } from './services/permissions/permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CompaniesService } from './services/companies/companies.service';
import { CompaniesController } from './controllers/companies/companies.controller';
import { Company } from './entities/company.entity';
import { CompanyUserRole } from './entities/company-user-role.entity';
import { RolePermissionContext } from './entities/role-permission-context.entity';
import { Team } from './entities/team.entity';
import { TeamUserRole } from './entities/team-user-role.entity';
import { TeamsService } from './services/teams/teams.service';
import { DataCollectorsModule } from 'src/data-collectors/data-collectors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      CompanyUserRole,
      Team,
      TeamUserRole,
      Role,
      RolePermissionContext,
      Permission,
    ]),
    forwardRef(() => DataCollectorsModule),
  ],
  controllers: [
    UsersController,
    CompaniesController,
    RolesController,
    PermissionsController,
  ],
  providers: [
    {
      provide: UsersService,
      useClass: UsersService,
    },
    {
      provide: CompaniesService,
      useClass: CompaniesService,
    },
    {
      provide: TeamsService,
      useClass: TeamsService,
    },
    {
      provide: RolesService,
      useClass: RolesService,
    },
    {
      provide: PermissionsService,
      useClass: PermissionsService,
    },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersManagementModule {}
