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
  CreateCompanyDto,
  UpdateCompanyDto,
} from 'src/users-management/dtos/companies.dtos';
import { CompaniesService } from 'src/users-management/services/companies/companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesServices: CompaniesService) {}

  @Permissions('company:readAll')
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.companiesServices.findAll();
  }

  @Permissions('company:readOne')
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.companiesServices.findOne(uuid);
  }

  @Permissions('company:checkEmail')
  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  checkEmail(@Param('email') email: string) {
    return this.companiesServices.checkEmail(email);
  }

  @Permissions('company:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateCompanyDto) {
    return this.companiesServices.create(payload);
  }

  @Permissions('company:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateCompanyDto,
  ) {
    return this.companiesServices.update(uuid, payload);
  }

  @Permissions('company:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.companiesServices.remove(uuid);
  }
}
