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

import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from 'src/users-management/entities/user.entity';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user: User = req.user as User;
    const { accessToken } = await this.authService.generateJWT(user);

    const isProduction: boolean = process.env.NODE_ENV === 'production';
    const isStaging: boolean = process.env.APP_ENV === 'staging';
    const isStagingDomain: string | undefined = isStaging
      ? 'staging.solutionazer.app'
      : undefined;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction || isStaging,
      sameSite: 'lax',
      domain: isProduction ? '.solutionazer.app' : isStagingDomain,
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    const { uuid, fullName, email } = user;
    const safeUser = { uuid, fullName, email };

    res.status(200).json({ message: 'Login successful', user: safeUser });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    const isProduction: boolean = process.env.NODE_ENV === 'production';
    const isStaging: boolean = process.env.APP_ENV === 'staging';

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction || isStaging,
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logged out' });
  }
}
