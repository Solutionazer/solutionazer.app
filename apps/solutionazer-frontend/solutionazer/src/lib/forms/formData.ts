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

interface FormDataProps {
  email: string
  userType: string
  password?: string
  passwordToConfirm?: string
  fullName?: string
  companyName?: string
}

export default class FormData {
  private readonly fullName: string | undefined
  private readonly companyName: string | undefined
  private readonly email: string
  private readonly password: string | undefined
  private readonly passwordToConfirm: string | undefined
  private readonly userType: string

  constructor(private readonly props: FormDataProps) {
    this.fullName = props.fullName
    this.companyName = props.companyName
    this.email = props.email
    this.password = props.password
    this.passwordToConfirm = props.passwordToConfirm
    this.userType = props.userType
  }

  public getFullName(): string | undefined {
    return this.fullName
  }

  public getCompanyName(): string | undefined {
    return this.companyName
  }

  public getEmail(): string {
    return this.email
  }

  public getPassword(): string | undefined {
    return this.password
  }

  public getPasswordToConfirm(): string | undefined {
    return this.passwordToConfirm
  }

  public getUserType(): string {
    return this.userType
  }
}
