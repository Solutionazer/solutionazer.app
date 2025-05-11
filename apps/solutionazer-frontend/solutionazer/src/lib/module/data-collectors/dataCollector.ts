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

import Question from './questions/question'

interface DataCollectorProps {
  uuid?: string
  title?: string
  description?: string
  type?: string
  userUuid?: string
  questions?: Question[]
  updatedAt?: Date
  createdAt?: Date
}

export default class DataCollector {
  private readonly uuid: string | undefined
  private readonly title: string | undefined
  private readonly description: string | undefined
  private readonly type: string | undefined
  private readonly userUuid: string | undefined
  private readonly questions: Question[] | undefined
  private readonly updatedAt: Date | undefined
  private readonly createdAt: Date | undefined

  constructor(private readonly props: DataCollectorProps) {
    this.uuid = props.uuid
    this.title = props.title
    this.description = props.description
    this.type = props.type
    this.userUuid = props.userUuid
    this.questions = props.questions
    this.updatedAt = props.updatedAt
    this.createdAt = props.createdAt
  }

  public getUuid(): string | undefined {
    return this.uuid
  }

  public getTitle(): string | undefined {
    return this.title
  }

  public getDescription(): string | undefined {
    return this.description
  }

  public getType(): string | undefined {
    return this.type
  }

  public getUserUuid(): string | undefined {
    return this.userUuid
  }

  public getQuestions(): Question[] | undefined {
    return this.questions
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt
  }
}
