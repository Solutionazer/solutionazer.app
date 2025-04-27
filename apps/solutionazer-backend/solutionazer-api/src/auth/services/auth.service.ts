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

import { Injectable } from '@nestjs/common';
import { User } from 'src/users-management/entities/user.entity';
import { UsersService } from 'src/users-management/services/users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { PayloadToken } from '../models/payload-token.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User = await this.usersService.findOneByEmail(email);

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return user;
    }

    return null;
  }

  async generateJWT(user: User) {
    const userWithRoles: User = await this.usersService.findOneByUuidWithRoles(
      user.uuid,
    );

    const payload: PayloadToken =
      this.usersService.buildTokenPayload(userWithRoles);

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async refreshToken(userUuid: string) {
    const user: User = await this.usersService.findOneByUuidWithRoles(userUuid);
    const payload: PayloadToken = this.usersService.buildTokenPayload(user);

    return this.jwtService.sign(payload);
  }
}
