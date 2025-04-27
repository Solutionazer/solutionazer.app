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

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysController } from './controllers/surveys/surveys.controller';
import { QuestionsController } from './controllers/questions/questions.controller';
import { StatsController } from './controllers/stats/stats.controller';
import { TransitionsController } from './controllers/transitions/transitions.controller';
import { FormsService } from './services/forms/forms.service';
import { SurveysService } from './services/surveys/surveys.service';
import { QuestionsService } from './services/questions/questions.service';
import { StatsService } from './services/stats/stats.service';
import { TransitionsService } from './services/transitions/transitions.service';
import { FormsController } from './controllers/forms/forms.controller';
import { UsersManagementModule } from 'src/users-management/users-management.module';
import { DataCollector } from './entities/data-collector.entity';
import { Question } from './entities/question.entity';
import { Stats } from './entities/stats.entity';
import { Transition } from './entities/transition.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DataCollector, Question, Stats, Transition]),
    forwardRef(() => UsersManagementModule),
  ],
  controllers: [
    FormsController,
    SurveysController,
    QuestionsController,
    StatsController,
    TransitionsController,
  ],
  providers: [
    {
      provide: FormsService,
      useClass: FormsService,
    },
    {
      provide: SurveysService,
      useClass: SurveysService,
    },
    {
      provide: QuestionsService,
      useClass: QuestionsService,
    },
    {
      provide: StatsService,
      useClass: StatsService,
    },
    {
      provide: TransitionsService,
      useClass: TransitionsService,
    },
  ],
  exports: [TypeOrmModule],
})
export class DataCollectorsModule {}
