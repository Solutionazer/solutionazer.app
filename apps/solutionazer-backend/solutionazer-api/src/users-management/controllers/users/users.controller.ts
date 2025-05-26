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
  Query,
} from '@nestjs/common';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

import {
  CreateUserDto,
  UpdateUserDto,
} from 'src/users-management/dtos/users.dtos';
import { UsersService } from 'src/users-management/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Permissions('user:search')
  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchUsers(
    @Query('query') query: string,
    @Query('exclude') exclude: string,
  ) {
    const excludedUuids = exclude ? exclude.split(',') : [];

    return this.usersService.searchUsers(query, excludedUuids);
  }

  @Permissions('user:searchInCompany')
  @Get('search-in-company')
  @HttpCode(HttpStatus.OK)
  searchUsersInCompany(
    @Query('company', new ParseUUIDPipe()) companyUuid: string,
    @Query('query') query: string,
    @Query('exclude') exclude: string,
  ) {
    const excludedUuids = exclude
      ? exclude.split(',').filter((uuid) => uuid && uuid !== 'undefined')
      : [];

    return this.usersService.searchUsersInCompany(
      companyUuid,
      query,
      excludedUuids,
    );
  }

  @Permissions('user:searchInSameTeams')
  @Get('search-in-same-teams')
  @HttpCode(HttpStatus.OK)
  searchUsersInSameTeam(
    @Query('user', new ParseUUIDPipe()) user: string,
    @Query('query') query: string,
    @Query('exclude') exclude: string,
  ) {
    const excludedUuids = exclude
      ? exclude.split(',').filter((uuid) => uuid && uuid !== 'undefined')
      : [];

    return this.usersService.searchUsersInSameTeams(user, query, excludedUuids);
  }

  @Permissions('user:readAll')
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Permissions('user:readOne')
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Public()
  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  checkEmail(@Param('email') email: string) {
    return this.usersService.checkEmail(email);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Permissions('user:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(uuid, payload);
  }

  @Permissions('user:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
