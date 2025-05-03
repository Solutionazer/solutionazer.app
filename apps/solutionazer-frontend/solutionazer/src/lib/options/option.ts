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

import TruthyErrorExpected from '../errors/truthyErrorExpected'

export default class Option {
  private readonly id: number
  private readonly text: string

  constructor(id: number, text: string) {
    if (!id || !text) {
      throw new TruthyErrorExpected('Option values must be truthy')
    }

    this.id = id
    this.text = text
  }

  public getId(): number {
    return this.id
  }

  public getText(): string {
    return this.text
  }
}
