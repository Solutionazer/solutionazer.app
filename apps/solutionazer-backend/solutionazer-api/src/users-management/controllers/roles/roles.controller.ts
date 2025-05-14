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
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../../dtos/roles.dtos';
import { RolesService } from '../../services/roles/roles.service';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Permissions('role:readAllByUser')
  @Get(':userUuid')
  @HttpCode(HttpStatus.OK)
  findAllByUserUuid(@Param('userUuid', new ParseUUIDPipe()) userUuid: string) {
    return this.roleService.findAllByUserUuid(userUuid);
  }

  @Permissions('role:readAllByCompany')
  @Get(':companyUuid')
  @HttpCode(HttpStatus.OK)
  findAllByCompanyUuid(
    @Param('companyUuid', new ParseUUIDPipe()) companyUuid: string,
  ) {
    return this.roleService.findAllByCompanyUuid(companyUuid);
  }

  @Permissions('role:readAllByTeam')
  @Get(':teamUuid')
  @HttpCode(HttpStatus.OK)
  findAllByTeamUuid(@Param('teamUuid', new ParseUUIDPipe()) teamUuid: string) {
    return this.roleService.findAllByTeamUuid(teamUuid);
  }

  @Permissions('role:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateRoleDto) {
    return this.roleService.create(payload);
  }

  @Permissions('role:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.roleService.update(uuid, payload);
  }

  @Permissions('role:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.roleService.remove(uuid);
  }
}
