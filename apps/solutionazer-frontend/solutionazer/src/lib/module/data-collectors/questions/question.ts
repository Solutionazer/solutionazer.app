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

interface QuestionProps {
  uuid: string
  text: string
  required: boolean
  order: number
}

export default class Question {
  private readonly uuid: string
  private readonly text: string
  private readonly required: boolean
  private readonly order: number

  constructor(private readonly props: QuestionProps) {
    this.uuid = props.uuid
    this.text = props.text
    this.required = props.required
    this.order = props.order
  }

  public getUuid(): string {
    return this.uuid
  }

  public getText(): string {
    return this.text
  }

  public getRequired(): boolean {
    return this.required
  }

  public getOrder(): number {
    return this.order
  }
}
