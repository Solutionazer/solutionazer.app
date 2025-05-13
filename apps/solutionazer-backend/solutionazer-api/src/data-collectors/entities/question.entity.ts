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
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DataCollector } from './data-collector.entity';
import { Transition } from './transition.entity';
import { Exclude } from 'class-transformer';
import { QuestionType } from './question-type.entity';
import { QuestionResponse } from './question-response.entity';
import { DateConfig } from './questions/date-config.entity';
import { DropDownConfig } from './questions/dropdown-config.entity';
import { EmailConfig } from './questions/email-config.entity';
import { FileUploadConfig } from './questions/file-upload-config.entity';
import { GreetingsScreenConfig } from './questions/greetings-screen-config.entity';
import { LegalConfig } from './questions/legal-config.entity';
import { LongTextConfig } from './questions/long-text-config.entity';
import { MultipleChoiceConfig } from './questions/multiple-choice-config.entity';
import { PhoneNumberConfig } from './questions/phone-number-config.entity';
import { PictureChoiceConfig } from './questions/picture-choice-config.entity';
import { RatingConfig } from './questions/rating-config.entity';
import { ScaleConfig } from './questions/scale-config.entity';
import { ShortTextConfig } from './questions/short-text-config.entity';
import { StatementConfig } from './questions/statement-config.entity';
import { WebsiteConfig } from './questions/website-config.entity';
import { WelcomeScreenConfig } from './questions/welcome-screen-config.entity';
import { YesNoConfig } from './questions/yes-no-config.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'text', nullable: true, default: 'What...?' })
  text: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  required: boolean;

  @Column({ type: 'int', nullable: false })
  order: number;

  // forms / surveys
  @ManyToOne(() => DataCollector, (dataCollector) => dataCollector.questions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dataCollectorUuid' })
  dataCollector: DataCollector;

  // question type
  @ManyToOne(() => QuestionType, { nullable: false })
  @JoinColumn({ name: 'questionTypeUuid' })
  type: QuestionType;

  // date config
  @OneToOne(() => DateConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dateConfigUuid' })
  dateConfig: DateConfig;

  // dropdown config
  @OneToOne(() => DropDownConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dropDownConfigUuid' })
  dropDownConfig: DropDownConfig;

  // email config
  @OneToOne(() => EmailConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'emailConfigUuid' })
  emailConfig: EmailConfig;

  // file upload config
  @OneToOne(() => FileUploadConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fileUploadConfigUuid' })
  fileUploadConfig: FileUploadConfig;

  // greetings screen config
  @OneToOne(() => GreetingsScreenConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'greetingsScreenConfigUuid' })
  greetingsScreenConfig: GreetingsScreenConfig;

  // legal config
  @OneToOne(() => LegalConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'legalConfigUuid' })
  legalConfig: LegalConfig;

  // long text config
  @OneToOne(() => LongTextConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'longTextConfigUuid' })
  longTextConfig: LongTextConfig;

  // multiple choice config
  @OneToOne(() => MultipleChoiceConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'multipleChoiceConfigUuid' })
  multipleChoiceConfig: MultipleChoiceConfig;

  // phone number config
  @OneToOne(() => PhoneNumberConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'phoneNumberConfigUuid' })
  phoneNumberConfig: PhoneNumberConfig;

  // picture choice config
  @OneToOne(() => PictureChoiceConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pictureChoiceConfigUuid' })
  pictureChoiceConfig: PictureChoiceConfig;

  // rating config
  @OneToOne(() => RatingConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ratingConfigUuid' })
  ratingConfig: RatingConfig;

  // scale config
  @OneToOne(() => ScaleConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scaleConfigUuid' })
  scaleConfig: ScaleConfig;

  // short text config
  @OneToOne(() => ShortTextConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shortTextConfigUuid' })
  shortTextConfig: ShortTextConfig;

  // statement config
  @OneToOne(() => StatementConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'statementConfigUuid' })
  statementConfig: StatementConfig;

  // website config
  @OneToOne(() => WebsiteConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'websiteConfigUuid' })
  websiteConfig: WebsiteConfig;

  // welcome screen config
  @OneToOne(() => WelcomeScreenConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'welcomeScreenConfigUuid' })
  welcomeScreenConfig: WelcomeScreenConfig;

  // yes no config
  @OneToOne(() => YesNoConfig, {
    nullable: true,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'yesNoConfigUuid' })
  yesNoConfig: YesNoConfig;

  // transition
  @ManyToOne(() => Transition, (transition) => transition.question, {
    nullable: true,
  })
  @JoinColumn({ name: 'transitionUuid' })
  transition: Transition;

  // response
  @OneToMany(() => QuestionResponse, (response) => response.question)
  responses: QuestionResponse[];

  @Exclude()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
