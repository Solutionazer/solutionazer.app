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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from 'src/data-collectors/dtos/questions.dtos';
import { SubmitAnswerDto } from 'src/data-collectors/dtos/submit-answer.dtos';
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
import { LongTextConfig } from 'src/data-collectors/entities/questions/long-text-config.entity';
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
    @InjectRepository(LongTextConfig)
    private readonly longTextConfigRepository: Repository<LongTextConfig>,
  ) {}

  findAllTypes() {
    return this.questionTypeRepository.find();
  }

  async findConfig(configType: string, questionUuid: string) {
    switch (configType) {
      case 'welcome':
        return await this.welcomeScreenRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'legal':
        return await this.legalConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'date':
        return await this.dateConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'dropdown':
        return await this.dropDownConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'email':
        return await this.emailConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'file':
        return await this.fileUploadConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'multipleChoice':
        return await this.multipleChoiceConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'phone':
        return await this.phoneNumberConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'picture':
        return await this.pictureChoiceConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'rating':
        return await this.ratingConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'scale':
        return await this.scaleConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'shortText':
        return await this.shortTextConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'statement':
        return await this.statementConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'website':
        return await this.websiteConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'yesNo':
        return await this.yesNoConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'greetings':
        return await this.greetingsScreenConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      case 'longText':
        return await this.longTextConfigRepository.findOne({
          where: { question: { uuid: questionUuid } },
        });
      default:
        throw new Error(`Unknown config type: ${configType}`);
    }
  }

  findAllByFormUuid(uuid: string) {
    return this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.type', 'type')
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
      .leftJoinAndSelect('question.type', 'type')
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
      relations: ['type'],
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

    switch (data.type) {
      case 'welcome': {
        const welcomeScreenConfig = this.welcomeScreenRepository.create({
          question: savedQuestion,
        });
        await this.welcomeScreenRepository.save(welcomeScreenConfig);
        break;
      }
      case 'legal': {
        const legalConfig = this.legalConfigRepository.create({
          question: savedQuestion,
        });
        await this.legalConfigRepository.save(legalConfig);
        break;
      }
      case 'date': {
        const dateConfig = this.dateConfigRepository.create({
          question: savedQuestion,
        });
        await this.dateConfigRepository.save(dateConfig);
        break;
      }
      case 'dropdown': {
        const dropDownConfig = this.dropDownConfigRepository.create({
          question: savedQuestion,
        });
        await this.dropDownConfigRepository.save(dropDownConfig);
        break;
      }
      case 'email': {
        const emailConfig = this.emailConfigRepository.create({
          question: savedQuestion,
        });
        await this.emailConfigRepository.save(emailConfig);
        break;
      }
      case 'file': {
        const fileUploadConfig = this.fileUploadConfigRepository.create({
          question: savedQuestion,
        });
        await this.fileUploadConfigRepository.save(fileUploadConfig);
        break;
      }
      case 'multipleChoice': {
        const multipleChoice = this.multipleChoiceConfigRepository.create({
          question: savedQuestion,
        });
        await this.multipleChoiceConfigRepository.save(multipleChoice);
        break;
      }
      case 'phone': {
        const phoneNumberConfig = this.phoneNumberConfigRepository.create({
          question: savedQuestion,
        });
        await this.phoneNumberConfigRepository.save(phoneNumberConfig);
        break;
      }
      case 'picture': {
        const pictureChoiceConfig = this.pictureChoiceConfigRepository.create({
          question: savedQuestion,
        });
        await this.pictureChoiceConfigRepository.save(pictureChoiceConfig);
        break;
      }
      case 'rating': {
        const ratingConfig = this.ratingConfigRepository.create({
          question: savedQuestion,
        });
        await this.ratingConfigRepository.save(ratingConfig);
        break;
      }
      case 'scale': {
        const scaleConfig = this.scaleConfigRepository.create({
          question: savedQuestion,
        });
        await this.scaleConfigRepository.save(scaleConfig);
        break;
      }
      case 'shortText': {
        const shortTextConfig = this.shortTextConfigRepository.create({
          question: savedQuestion,
        });
        await this.shortTextConfigRepository.save(shortTextConfig);
        break;
      }

      case 'statement': {
        const statementConfig = this.statementConfigRepository.create({
          question: savedQuestion,
        });
        await this.statementConfigRepository.save(statementConfig);
        break;
      }
      case 'website': {
        const websiteConfig = this.websiteConfigRepository.create({
          question: savedQuestion,
        });
        await this.websiteConfigRepository.save(websiteConfig);
        break;
      }
      case 'yesNo': {
        const yesNoConfig = this.yesNoConfigRepository.create({
          question: savedQuestion,
        });
        await this.yesNoConfigRepository.save(yesNoConfig);
        break;
      }
      case 'greetings': {
        const greetingsScreenConfig =
          this.greetingsScreenConfigRepository.create({
            question: savedQuestion,
          });
        await this.greetingsScreenConfigRepository.save(greetingsScreenConfig);
        break;
      }
      case 'longText': {
        const longTextConfig = this.longTextConfigRepository.create({
          question: savedQuestion,
        });
        await this.longTextConfigRepository.save(longTextConfig);
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

  async updateWelcomeScreenConfig(
    uuid: string,
    changes: { headline: string; description: string },
  ) {
    const welcomeScreenConfig: WelcomeScreenConfig | null =
      await this.welcomeScreenRepository.findOne({ where: { uuid } });

    if (!welcomeScreenConfig) {
      throw new NotFoundException(`WelcomeScreeConfig = { uuid: ${uuid} }`);
    }

    this.welcomeScreenRepository.merge(welcomeScreenConfig, changes);

    return this.welcomeScreenRepository.save(welcomeScreenConfig);
  }

  async updateLegalConfig(uuid: string, changes: { legalText: string }) {
    const legalConfig: LegalConfig | null =
      await this.legalConfigRepository.findOne({
        where: { uuid },
      });

    if (!legalConfig) {
      throw new NotFoundException(`LegalConfig = { uuid: ${uuid} }`);
    }

    this.legalConfigRepository.merge(legalConfig, changes);

    return this.legalConfigRepository.save(legalConfig);
  }

  async updateStatementConfig(uuid: string, changes: { content: string }) {
    const statementConfig: StatementConfig | null =
      await this.statementConfigRepository.findOne({
        where: { uuid },
      });

    if (!statementConfig) {
      throw new NotFoundException(`StatementConfig = { uuid: ${uuid} }`);
    }

    this.statementConfigRepository.merge(statementConfig, changes);

    return this.statementConfigRepository.save(statementConfig);
  }

  async updateGreetingsScreenConfig(
    uuid: string,
    changes: { message: string },
  ) {
    const greetingsScreenConfig: GreetingsScreenConfig | null =
      await this.greetingsScreenConfigRepository.findOne({
        where: { uuid },
      });

    if (!greetingsScreenConfig) {
      throw new NotFoundException(`GreetingsScreenConfig = { uuid: ${uuid} }`);
    }

    this.greetingsScreenConfigRepository.merge(greetingsScreenConfig, changes);

    return this.greetingsScreenConfigRepository.save(greetingsScreenConfig);
  }

  async updateWebsiteConfig(uuid: string, changes: { url: string }) {
    const websiteConfig: WebsiteConfig | null =
      await this.websiteConfigRepository.findOne({
        where: { uuid },
      });

    if (!websiteConfig) {
      throw new NotFoundException(`WebsiteConfig = { uuid: ${uuid} }`);
    }

    this.websiteConfigRepository.merge(websiteConfig, changes);

    return this.websiteConfigRepository.save(websiteConfig);
  }

  async submitAnswer(data: SubmitAnswerDto) {
    const question: Question = await this.findOne(data.questionUuid);

    const questionType = question.type.name;

    let validValue: any;

    switch (questionType) {
      case 'yesNo': {
        if (typeof data.value !== 'boolean') {
          throw new BadRequestException('Expected boolean');
        }

        validValue = data.value;
        break;
      }
      case 'legal': {
        if (data.value !== true) {
          throw new BadRequestException('Legal consent must be accepted');
        }

        validValue = data.value;
        break;
      }
      case 'date': {
        const parsedDate = new Date(String(data.value));

        if (isNaN(parsedDate.getTime())) {
          throw new BadRequestException(
            'Expected valid date string (YYYY-MM-DD)',
          );
        }

        validValue = parsedDate;
        break;
      }
      case 'email': {
        if (
          typeof data.value !== 'string' ||
          !/^\S+@\S+\.\S+$/.test(data.value)
        ) {
          throw new BadRequestException('Expected valid email');
        }

        validValue = data.value;
        break;
      }
      case 'phone': {
        if (typeof data.value !== 'string') {
          throw new BadRequestException('Expected valid phone number');
        }

        validValue = data.value;
        break;
      }
      case 'shortText':
      case 'longText': {
        if (typeof data.value !== 'string') {
          throw new BadRequestException('Expected string');
        }

        validValue = data.value;
        break;
      }
      case 'rating': {
        if (typeof data.value !== 'number') {
          throw new BadRequestException('Expected number');
        }

        validValue = data.value;
        break;
      }
      default:
        throw new BadRequestException('Unsupported question type');
    }

    const existingAnswer = await this.questionResponseRepository.findOne({
      where: {
        question: { uuid: question.uuid },
        sessionUuid: data.sessionUuid,
      },
      relations: ['question'],
    });

    if (existingAnswer) {
      throw new NotFoundException(`Already answered this question`);
    }

    const response = this.questionResponseRepository.create({
      question,
      sessionUuid: data.sessionUuid,
    });

    switch (questionType) {
      case 'yesNo': {
        response.booleanValue = validValue;
        break;
      }
      case 'legal': {
        response.booleanValue = validValue;
        break;
      }
      case 'date': {
        response.dateValue = validValue;
        break;
      }
      case 'email': {
        response.textValue = validValue;
        break;
      }
      case 'phone': {
        response.textValue = validValue;
        break;
      }
      case 'shortText':
      case 'longText': {
        response.textValue = validValue;
        break;
      }
      case 'rating': {
        response.intValue = validValue;
        break;
      }
    }

    await this.questionResponseRepository.save(response);

    return { success: true };
  }

  async remove(uuid: string) {
    const question = await this.findOne(uuid);

    await this.questionResponseRepository.delete({ question: { uuid } });

    const questionTypeName = question.type.name;

    switch (questionTypeName) {
      case 'welcome': {
        const welcomeScreenConfig = await this.welcomeScreenRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (welcomeScreenConfig) {
          await this.welcomeScreenRepository.delete(welcomeScreenConfig.uuid);
        }

        break;
      }

      case 'legal': {
        const legalConfig = await this.legalConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (legalConfig) {
          await this.legalConfigRepository.delete(legalConfig.uuid);
        }

        break;
      }
      case 'date': {
        const dateConfig = await this.dateConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (dateConfig) {
          await this.dateConfigRepository.delete(dateConfig.uuid);
        }

        break;
      }
      case 'dropdown': {
        const dropDownConfig = await this.dropDownConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (dropDownConfig) {
          await this.dropDownConfigRepository.delete(dropDownConfig.uuid);
        }

        break;
      }
      case 'email': {
        const emailConfig = await this.emailConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (emailConfig) {
          await this.emailConfigRepository.delete(emailConfig.uuid);
        }

        break;
      }
      case 'file': {
        const fileUploadConfig = await this.fileUploadConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (fileUploadConfig) {
          await this.fileUploadConfigRepository.delete(fileUploadConfig.uuid);
        }

        break;
      }
      case 'multipleChoice': {
        const multipleChoiceConfig =
          await this.multipleChoiceConfigRepository.findOne({
            where: { question: { uuid } },
            relations: ['question'],
          });

        if (multipleChoiceConfig) {
          await this.multipleChoiceConfigRepository.delete(
            multipleChoiceConfig.uuid,
          );
        }

        break;
      }
      case 'phone': {
        const phoneNumberConfig =
          await this.phoneNumberConfigRepository.findOne({
            where: { question: { uuid } },
            relations: ['question'],
          });

        if (phoneNumberConfig) {
          await this.phoneNumberConfigRepository.delete(phoneNumberConfig.uuid);
        }

        break;
      }
      case 'picture': {
        const pictureChoiceConfig =
          await this.pictureChoiceConfigRepository.findOne({
            where: { question: { uuid } },
            relations: ['question'],
          });

        if (pictureChoiceConfig) {
          await this.pictureChoiceConfigRepository.delete(
            pictureChoiceConfig.uuid,
          );
        }

        break;
      }
      case 'rating': {
        const ratingConfig = await this.ratingConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (ratingConfig) {
          await this.ratingConfigRepository.delete(ratingConfig.uuid);
        }

        break;
      }
      case 'scale': {
        const scaleConfig = await this.scaleConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (scaleConfig) {
          await this.scaleConfigRepository.delete(scaleConfig.uuid);
        }

        break;
      }
      case 'shortText': {
        const shortTextConfig = await this.shortTextConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (shortTextConfig) {
          await this.shortTextConfigRepository.delete(shortTextConfig.uuid);
        }

        break;
      }

      case 'statement': {
        const statementConfig = await this.statementConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (statementConfig) {
          await this.statementConfigRepository.delete(statementConfig.uuid);
        }

        break;
      }
      case 'website': {
        const websiteConfig = await this.websiteConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (websiteConfig) {
          await this.websiteConfigRepository.delete(websiteConfig.uuid);
        }

        break;
      }
      case 'yesNo': {
        const yesNoConfig = await this.yesNoConfigRepository.findOne({
          where: { question: { uuid } },
          relations: ['question'],
        });

        if (yesNoConfig) {
          await this.yesNoConfigRepository.delete(yesNoConfig.uuid);
        }

        break;
      }
      case 'greetings': {
        const greetingsScreenConfig =
          await this.greetingsScreenConfigRepository.findOne({
            where: { question: { uuid } },
            relations: ['question'],
          });

        if (greetingsScreenConfig) {
          await this.greetingsScreenConfigRepository.delete(
            greetingsScreenConfig.uuid,
          );
        }

        break;
      }
    }

    return this.questionRepository.delete(uuid);
  }
}
