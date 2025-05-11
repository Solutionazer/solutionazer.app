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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from 'src/data-collectors/dtos/questions.dtos';
import { DataCollector } from 'src/data-collectors/entities/data-collector.entity';
import { QuestionResponse } from 'src/data-collectors/entities/question-response.entity';
import { QuestionType } from 'src/data-collectors/entities/question-type.entity';
import { Question } from 'src/data-collectors/entities/question.entity';
import { DateConfig } from 'src/data-collectors/entities/questions/date-config.entity';
import { DropDownConfig } from 'src/data-collectors/entities/questions/dropdown-config.entity';
import { EmailConfig } from 'src/data-collectors/entities/questions/email-config.entity';
import { FileUploadConfig } from 'src/data-collectors/entities/questions/file-upload-config.entity';
import { GreetingsScreenConfig } from 'src/data-collectors/entities/questions/greetings-screen-config.entity';
import { LegalConfig } from 'src/data-collectors/entities/questions/legal-config.entity';
import { MultipleChoiceConfig } from 'src/data-collectors/entities/questions/multiple-choice-config.entity';
import { PhoneNumberConfig } from 'src/data-collectors/entities/questions/phone-number-config.entity';
import { PictureChoiceConfig } from 'src/data-collectors/entities/questions/picture-choice-config.entity';
import { RatingConfig } from 'src/data-collectors/entities/questions/rating-config.entity';
import { ScaleConfig } from 'src/data-collectors/entities/questions/scale-config.entity';
import { ShortTextConfig } from 'src/data-collectors/entities/questions/short-text-config.entity';
import { StatementConfig } from 'src/data-collectors/entities/questions/statement-config.entity';
import { WebsiteConfig } from 'src/data-collectors/entities/questions/website-config.entity';
import { WelcomeScreenConfig } from 'src/data-collectors/entities/questions/welcome-screen-config.entity';
import { YesNoConfig } from 'src/data-collectors/entities/questions/yes-no-config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(DataCollector)
    private readonly dataCollectorRepository: Repository<DataCollector>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionType)
    private readonly questionTypeRepository: Repository<QuestionType>,
    @InjectRepository(WelcomeScreenConfig)
    private readonly welcomeScreenRepository: Repository<WelcomeScreenConfig>,
    @InjectRepository(LegalConfig)
    private readonly legalConfigRepository: Repository<LegalConfig>,
    @InjectRepository(DateConfig)
    private readonly dateConfigRepository: Repository<DateConfig>,
    @InjectRepository(DropDownConfig)
    private readonly dropDownConfigRepository: Repository<DropDownConfig>,
    @InjectRepository(EmailConfig)
    private readonly emailConfigRepository: Repository<EmailConfig>,
    @InjectRepository(FileUploadConfig)
    private readonly fileUploadConfigRepository: Repository<FileUploadConfig>,
    @InjectRepository(MultipleChoiceConfig)
    private readonly multipleChoiceConfigRepository: Repository<MultipleChoiceConfig>,
    @InjectRepository(PhoneNumberConfig)
    private readonly phoneNumberConfigRepository: Repository<PhoneNumberConfig>,
    @InjectRepository(PictureChoiceConfig)
    private readonly pictureChoiceConfigRepository: Repository<PictureChoiceConfig>,
    @InjectRepository(RatingConfig)
    private readonly ratingConfigRepository: Repository<RatingConfig>,
    @InjectRepository(ScaleConfig)
    private readonly scaleConfigRepository: Repository<ScaleConfig>,
    @InjectRepository(ShortTextConfig)
    private readonly shortTextConfigRepository: Repository<ShortTextConfig>,
    @InjectRepository(StatementConfig)
    private readonly statementConfigRepository: Repository<StatementConfig>,
    @InjectRepository(WebsiteConfig)
    private readonly websiteConfigRepository: Repository<WebsiteConfig>,
    @InjectRepository(YesNoConfig)
    private readonly yesNoConfigRepository: Repository<YesNoConfig>,
    @InjectRepository(GreetingsScreenConfig)
    private readonly greetingsScreenConfigRepository: Repository<GreetingsScreenConfig>,
    @InjectRepository(QuestionResponse)
    private readonly questionResponseRepository: Repository<QuestionResponse>,
  ) {}

  findAllTypes() {
    return this.questionTypeRepository.find();
  }

  findAllByFormUuid(uuid: string) {
    return this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.dataCollector', 'dataCollector')
      .where('dataCollector.uuid = :uuid', { uuid })
      .andWhere('dataCollector.type = :type', {
        type: 'form',
      })
      .orderBy('question.order', 'ASC')
      .getMany();
  }

  findAllBySurveyUuid(uuid: string) {
    return this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.dataCollector', 'dataCollector')
      .where('dataCollector.uuid = :uuid', { uuid })
      .andWhere('dataCollector.type = :type', {
        type: 'survey',
      })
      .orderBy('question.order', 'ASC')
      .getMany();
  }

  async findOne(uuid: string) {
    const question: Question | null = await this.questionRepository.findOne({
      where: { uuid },
    });

    if (!question) {
      throw new NotFoundException(`Question = { uuid: ${uuid} } not found`);
    }

    return question;
  }

  async create(data: CreateQuestionDto) {
    const type: QuestionType | null =
      await this.questionTypeRepository.findOneBy({
        name: data.type,
      });

    if (!type) {
      throw new NotFoundException(
        `QuestionType = { name: ${data.type} } not found`,
      );
    }

    const dataCollector: DataCollector | null =
      await this.dataCollectorRepository.findOneBy({
        uuid: data.dataCollectorUuid,
      });

    if (!dataCollector) {
      throw new NotFoundException(
        `DataCollector = { uuid: ${data.dataCollectorUuid} } not found`,
      );
    }

    const question = this.questionRepository.create({
      text: data.text,
      required: data.required,
      order: data.order,
      type,
      dataCollector,
    });

    const savedQuestion = await this.questionRepository.save(question);

    const answer = this.questionResponseRepository.create({
      question: savedQuestion,
    });
    await this.questionResponseRepository.save(answer);

    switch (data.type) {
      case 'Welcome': {
        const welcomeScreenConfig = this.welcomeScreenRepository.create({
          questionType: type,
        });
        await this.welcomeScreenRepository.save(welcomeScreenConfig);
        break;
      }
      case 'Legal': {
        const legalConfig = this.legalConfigRepository.create({
          questionType: type,
        });
        await this.legalConfigRepository.save(legalConfig);
        break;
      }
      case 'Date': {
        const dateConfig = this.dateConfigRepository.create({
          questionType: type,
        });
        await this.dateConfigRepository.save(dateConfig);
        break;
      }
      case 'Dropdown': {
        const dropDownConfig = this.dropDownConfigRepository.create({
          questionType: type,
        });
        await this.dropDownConfigRepository.save(dropDownConfig);
        break;
      }
      case 'Email': {
        const emailConfig = this.emailConfigRepository.create({
          questionType: type,
        });
        await this.emailConfigRepository.save(emailConfig);
        break;
      }
      case 'File': {
        const fileUploadConfig = this.fileUploadConfigRepository.create({
          questionType: type,
        });
        await this.fileUploadConfigRepository.save(fileUploadConfig);
        break;
      }
      case 'Multiple Choice': {
        const multipleChoice = this.multipleChoiceConfigRepository.create({
          questionType: type,
        });
        await this.multipleChoiceConfigRepository.save(multipleChoice);
        break;
      }
      case 'Phone': {
        const phoneNumberConfig = this.phoneNumberConfigRepository.create({
          questionType: type,
        });
        await this.phoneNumberConfigRepository.save(phoneNumberConfig);
        break;
      }
      case 'Picture': {
        const pictureChoiceConfig = this.pictureChoiceConfigRepository.create({
          questionType: type,
        });
        await this.pictureChoiceConfigRepository.save(pictureChoiceConfig);
        break;
      }
      case 'Rating': {
        const ratingConfig = this.ratingConfigRepository.create({
          questionType: type,
        });
        await this.ratingConfigRepository.save(ratingConfig);
        break;
      }
      case 'Scale': {
        const scaleConfig = this.scaleConfigRepository.create({
          questionType: type,
        });
        await this.scaleConfigRepository.save(scaleConfig);
        break;
      }
      case 'Short Text': {
        const shortTextConfig = this.shortTextConfigRepository.create({
          questionType: type,
        });
        await this.shortTextConfigRepository.save(shortTextConfig);
        break;
      }

      case 'Statement': {
        const statementConfig = this.statementConfigRepository.create({
          questionType: type,
        });
        await this.statementConfigRepository.save(statementConfig);
        break;
      }
      case 'Website': {
        const websiteConfig = this.websiteConfigRepository.create({
          questionType: type,
        });
        await this.websiteConfigRepository.save(websiteConfig);
        break;
      }
      case 'Yes No': {
        const yesNoConfig = this.yesNoConfigRepository.create({
          questionType: type,
        });
        await this.yesNoConfigRepository.save(yesNoConfig);
        break;
      }
      case 'Greetings': {
        const greetingsScreenConfig =
          this.greetingsScreenConfigRepository.create({ questionType: type });
        await this.greetingsScreenConfigRepository.save(greetingsScreenConfig);
        break;
      }
    }

    return savedQuestion;
  }

  async update(uuid: string, changes: UpdateQuestionDto) {
    const question: Question = await this.findOne(uuid);

    let type: QuestionType | undefined = undefined;

    if (changes.type) {
      type = (await this.questionTypeRepository.findOneBy({
        name: changes.type,
      }))!;

      if (!type) {
        throw new NotFoundException(
          `QuestionType = { name: ${changes.type} } not found`,
        );
      }
    }

    this.questionRepository.merge(question, {
      ...changes,
      type,
    });

    return this.questionRepository.save(question);
  }

  async remove(uuid: string) {
    await this.findOne(uuid);
    return this.questionRepository.delete(uuid);
  }
}
