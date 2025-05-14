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

import { Module } from '@nestjs/common';
import { InterviewsService } from './services/interviews/interviews.service';
import { InterviewsController } from './controllers/interviews/interviews.controller';
import { QuestionsController } from './controllers/questions/questions.controller';
import { AnswersController } from './controllers/answers/answers.controller';
import { QuestionsService } from './services/questions/questions.service';
import { AnswersService } from './services/answers/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [InterviewsController, QuestionsController, AnswersController],
  providers: [
    {
      provide: InterviewsService,
      useClass: InterviewsService,
    },
    {
      provide: QuestionsService,
      useClass: QuestionsService,
    },
    {
      provide: AnswersService,
      useClass: AnswersService,
    },
  ],
})
export class InterviewsModule {}
