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
  CreateQuestionDto,
  UpdateQuestionDto,
} from 'src/data-collectors/dtos/questions.dtos';
import { QuestionsService } from 'src/data-collectors/services/questions/questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Permissions('question:readAllByForm')
  @Get('form/:formUuid')
  @HttpCode(HttpStatus.OK)
  findAllByFormUuid(@Param('formUuid', new ParseUUIDPipe()) formUuid: string) {
    return this.questionsService.findAllByFormUuid(formUuid);
  }

  @Permissions('question:readAllBySurvey')
  @Get('survey/:surveyUuid')
  @HttpCode(HttpStatus.OK)
  findAllBySurveyUuid(
    @Param('surveyUuid', new ParseUUIDPipe()) surveyUuid: string,
  ) {
    return this.questionsService.findAllBySurveyUuid(surveyUuid);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateQuestionDto) {
    return this.questionsService.create(payload);
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateQuestionDto,
  ) {
    return this.questionsService.update(uuid, payload);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.questionsService.remove(uuid);
  }
}
