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
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordToken } from '../../mailer/entities/password-reset-token.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordToken>,
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

  async generatePasswordResetToken(user: User) {
    const token = randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + (60 * 60) / 1000);

    await this.resetPasswordTokenRepository.save({
      userUuid: user.uuid,
      token,
      type: 'password_reset',
      expiresAt,
    });

    return token;
  }

  async validatePasswordResetToken(token: string) {
    const tokenEntry = await this.resetPasswordTokenRepository.findOne({
      where: {
        token,
        expiresAt: MoreThan(new Date()),
      },
    });

    return tokenEntry?.user || null;
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenEntry = await this.resetPasswordTokenRepository.findOne({
      where: {
        token,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!tokenEntry) {
      throw new Error('Invalid or expired token');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    tokenEntry.user.password = hash;
  }

  async sendPasswordRecoveryEmail(email: string, recoveryUrl: string) {}
}
