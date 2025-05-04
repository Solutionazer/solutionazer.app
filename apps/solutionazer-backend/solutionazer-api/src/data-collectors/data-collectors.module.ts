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
import { QuestionType } from './entities/question-type.entity';
import { MultipleChoiceConfig } from './entities/questions/multiple-choice-config.entity';
import { ScaleConfig } from './entities/questions/scale-config.entity';
import { ShortTextConfig } from './entities/questions/short-text-config.entity';
import { LongTextConfig } from './entities/questions/long-text-config.entity';
import { YesNoConfig } from './entities/questions/yes-no-config.entity';
import { EmailConfig } from './entities/questions/email-config.entity';
import { DateConfig } from './entities/questions/date-config.entity';
import { FileUploadConfig } from './entities/questions/file-upload-config.entity';
import { DropDownConfig } from './entities/questions/dropdown-config.entity';
import { LegalConfig } from './entities/questions/legal-config.entity';
import { WebsiteConfig } from './entities/questions/website-config.entity';
import { StatementConfig } from './entities/questions/statement-config.entity';
import { RatingConfig } from './entities/questions/rating-config.entity';
import { PhoneNumberConfig } from './entities/questions/phone-number-config.entity';
import { PictureChoiceConfig } from './entities/questions/picture-choice-config.entity';
import { GreetingsScreenConfig } from './entities/questions/greetings-screen-config.entity';
import { WelcomeScreenConfig } from './entities/questions/welcome-screen-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataCollector,
      Question,
      QuestionType,
      MultipleChoiceConfig,
      ScaleConfig,
      ShortTextConfig,
      LongTextConfig,
      YesNoConfig,
      EmailConfig,
      DateConfig,
      FileUploadConfig,
      DropDownConfig,
      LegalConfig,
      WebsiteConfig,
      StatementConfig,
      RatingConfig,
      PhoneNumberConfig,
      PictureChoiceConfig,
      GreetingsScreenConfig,
      WelcomeScreenConfig,
      Stats,
      Transition,
    ]),
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
