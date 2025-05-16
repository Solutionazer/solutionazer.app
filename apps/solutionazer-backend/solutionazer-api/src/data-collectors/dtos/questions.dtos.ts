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

import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsOptional()
  @IsString()
  readonly text: string;

  @IsOptional()
  @IsBoolean()
  readonly required: boolean;

  @IsNotEmpty()
  @IsNumber()
  readonly order: number;

  @IsNotEmpty()
  @IsIn([
    'welcome',
    'legal',
    'date',
    'dropdown',
    'email',
    'file',
    'multipleChoice',
    'phone',
    'picture',
    'rating',
    'scale',
    'shortText',
    'statement',
    'website',
    'yesNo',
    'greetings',
    'longText',
  ])
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly dataCollectorUuid: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
