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
  CreateStatsDto,
  UpdateStatsDto,
} from 'src/data-collectors/dtos/stats.dtos';
import { StatsService } from 'src/data-collectors/services/stats/stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Permissions('stats:readOneByDataCollector')
  @Get(':dataCollectorUuid')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('dataCollectorUuid', new ParseUUIDPipe()) dataCollectorUuid: string,
  ) {
    return this.statsService.findOne(dataCollectorUuid);
  }

  @Permissions('stats:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateStatsDto) {
    return this.statsService.create(payload);
  }

  @Permissions('stats:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateStatsDto,
  ) {
    return this.statsService.update(uuid, payload);
  }

  @Permissions('stats:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.statsService.remove(uuid);
  }
}
