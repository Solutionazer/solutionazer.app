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
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  CreateDataCollectorDto,
  UpdateDataCollectorDto,
} from 'src/data-collectors/dtos/data-collectors.dtos';
import { FormsService } from 'src/data-collectors/services/forms/forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Public()
  @Get('public/:uuid')
  @HttpCode(HttpStatus.OK)
  findPublicForm(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.formsService.findPublicForm(uuid);
  }

  @Permissions('form:publish')
  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  publish(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.formsService.publish(uuid);
  }

  @Permissions('form:readAllByUser')
  @Get(':userUuid')
  @HttpCode(HttpStatus.OK)
  findAllByUserUuid(@Param('userUuid', new ParseUUIDPipe()) userUuid: string) {
    return this.formsService.findAllByUserUuid(userUuid);
  }

  @Permissions('form:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateDataCollectorDto) {
    return this.formsService.create(payload);
  }

  @Permissions('form:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateDataCollectorDto,
  ) {
    return this.formsService.update(uuid, payload);
  }

  @Permissions('form:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.formsService.remove(uuid);
  }
}
