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

import Admin from './admins/admin'
import Member from './members/member'

interface CompanyProps {
  uuid: string
  name: string
  admins?: Admin[]
  members?: Member[]
}

export default class Company {
  private readonly uuid: string
  private readonly name: string
  private readonly admins: Admin[] | undefined
  private readonly members: Member[] | undefined

  constructor(private readonly props: CompanyProps) {
    this.uuid = props.uuid
    this.name = props.name
    this.admins = props.admins
    this.members = props.members
  }

  public getUuid(): string {
    return this.uuid
  }

  public getName(): string {
    return this.name
  }

  public getAdmins(): Admin[] | undefined {
    return this.admins
  }

  public getMembers(): Member[] | undefined {
    return this.members
  }
}
