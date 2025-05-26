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
import { SurveysService } from 'src/data-collectors/services/surveys/surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Public()
  @Get('public/:uuid')
  @HttpCode(HttpStatus.OK)
  findPublicSurvey(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.surveysService.findPublicSurvey(uuid);
  }

  @Permissions('form:publish')
  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  publish(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.surveysService.publish(uuid);
  }

  @Permissions('survey:readAllByUser')
  @Get(':userUuid')
  @HttpCode(HttpStatus.OK)
  findAllByUserUuid(@Param('userUuid', new ParseUUIDPipe()) userUuid: string) {
    return this.surveysService.findAllByUserUuid(userUuid);
  }

  @Permissions('survey:cloneToUser')
  @Post('clone-to-user/:surveyUuid')
  @HttpCode(HttpStatus.CREATED)
  async cloneSurveyToUser(
    @Param('surveyUuid', new ParseUUIDPipe()) surveyUuid: string,
    @Body() body: { targetUserUuid: string },
  ) {
    const { targetUserUuid } = body;

    if (!targetUserUuid) {
      throw new Error('targetUserUuid is required');
    }

    const clonedSurvey = await this.surveysService.cloneAndAssignToUser(
      surveyUuid,
      targetUserUuid,
    );

    return {
      message: 'Form cloned and assigned successfully',
      clonedSurvey,
    };
  }

  @Permissions('survey:deleteCloned')
  @Delete('undo-clone/:clonedSurveyUuid')
  @HttpCode(HttpStatus.OK)
  async undoClone(
    @Param('clonedSurveyUuid', new ParseUUIDPipe()) clonedSurveyUuid: string,
  ) {
    await this.surveysService.undoClone(clonedSurveyUuid);

    return {
      message: 'Cloned form deleted successfully',
    };
  }

  @Permissions('survey:readAllClones')
  @Get('clones/:surveyUuid')
  @HttpCode(HttpStatus.OK)
  getAllClones(@Param('surveyUuid') surveyUuid: string) {
    return this.surveysService.findAllClonesRecursively(surveyUuid);
  }

  @Permissions('survey:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateDataCollectorDto) {
    return this.surveysService.create(payload);
  }

  @Permissions('survey:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateDataCollectorDto,
  ) {
    return this.surveysService.update(uuid, payload);
  }

  @Permissions('survey:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.surveysService.remove(uuid);
  }
}
