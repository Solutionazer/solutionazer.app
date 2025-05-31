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
import { Public } from 'src/auth/decorators/public.decorator';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from 'src/data-collectors/dtos/questions.dtos';
import { SubmitAnswerDto } from 'src/data-collectors/dtos/submit-answer.dtos';
import { QuestionsService } from 'src/data-collectors/services/questions/questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Permissions('question:readAllTypes')
  @Get('types')
  @HttpCode(HttpStatus.OK)
  findAllTypes() {
    return this.questionsService.findAllTypes();
  }

  @Public()
  @Get('config/:configType/:questionUuid')
  @HttpCode(HttpStatus.OK)
  findConfig(
    @Param('configType') configType: string,
    @Param('questionUuid', new ParseUUIDPipe()) questionUuid: string,
  ) {
    return this.questionsService.findConfig(configType, questionUuid);
  }

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

  @Permissions('question:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateQuestionDto) {
    return this.questionsService.create(payload);
  }

  @Permissions('question:update')
  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: UpdateQuestionDto,
  ) {
    return this.questionsService.update(uuid, payload);
  }

  @Permissions('question:update')
  @Put('welcome/:uuid')
  @HttpCode(HttpStatus.OK)
  updateWelcomeScreenConfig(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: { headline: string; description: string },
  ) {
    return this.questionsService.updateWelcomeScreenConfig(uuid, payload);
  }

  @Permissions('question:update')
  @Put('legal/:uuid')
  @HttpCode(HttpStatus.OK)
  updateLegalConfig(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: { legalText: string },
  ) {
    return this.questionsService.updateLegalConfig(uuid, payload);
  }

  @Permissions('question:update')
  @Put('statement/:uuid')
  @HttpCode(HttpStatus.OK)
  updateStatementConfig(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: { content: string },
  ) {
    return this.questionsService.updateStatementConfig(uuid, payload);
  }

  @Permissions('question:update')
  @Put('greetings/:uuid')
  @HttpCode(HttpStatus.OK)
  updateGreetingsScreenConfig(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: { message: string },
  ) {
    return this.questionsService.updateGreetingsScreenConfig(uuid, payload);
  }

  @Permissions('question:update')
  @Put('website/:uuid')
  @HttpCode(HttpStatus.OK)
  updateWebsiteConfig(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() payload: { url: string },
  ) {
    return this.questionsService.updateWebsiteConfig(uuid, payload);
  }

  @Public()
  @Post('submit-answer')
  @HttpCode(HttpStatus.CREATED)
  submitAnswer(@Body() data: SubmitAnswerDto) {
    return this.questionsService.submitAnswer(data);
  }

  @Permissions('question:readAnswersGroupedBySessionUuid')
  @Get('answers/:uuid')
  @HttpCode(HttpStatus.OK)
  findAnswersGroupedBySessionUuid(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ) {
    return this.questionsService.findAnswersGroupedBySessionUuid(uuid);
  }

  @Permissions('question:delete')
  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.questionsService.remove(uuid);
  }
}
