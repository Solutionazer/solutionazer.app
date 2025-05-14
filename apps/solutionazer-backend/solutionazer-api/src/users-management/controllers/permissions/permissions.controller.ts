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
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../../dtos/permissions.dtos';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permissions('permission:readAllByRole')
  @Get(':roleUuid')
  @HttpCode(HttpStatus.OK)
  findAllByRoleUuid(@Param('roleUuid', new ParseUUIDPipe()) roleUuid: string) {
    return this.permissionsService.findAllByRoleUuid(roleUuid);
  }

  @Permissions('permission:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreatePermissionDto) {
    return this.permissionsService.create(payload);
  }

  @Permissions('permission:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(uuid, payload);
  }

  @Permissions('permission:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.permissionsService.remove(uuid);
  }
}
