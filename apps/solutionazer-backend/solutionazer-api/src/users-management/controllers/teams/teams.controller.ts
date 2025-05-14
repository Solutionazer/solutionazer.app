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
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import {
  CreateTeamDto,
  UpdateTeamDto,
} from 'src/users-management/dtos/teams.dtos';
import { TeamsService } from 'src/users-management/services/teams/teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Permissions('team:readAllByCompany')
  @Get('company/:uuid')
  @HttpCode(HttpStatus.OK)
  findAllByCompanyUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.teamsService.findAllByCompanyUuid(uuid);
  }

  @Permissions('team:readAllByUser')
  @Get('user/:uuid')
  @HttpCode(HttpStatus.OK)
  findAllByUserUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.teamsService.findAllByUserUuid(uuid);
  }

  @Permissions('team:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateTeamDto) {
    return this.teamsService.create(payload);
  }

  @Permissions('team:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateTeamDto,
  ) {
    return this.teamsService.update(uuid, payload);
  }

  @Permissions('team:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.teamsService.remove(uuid);
  }
}
