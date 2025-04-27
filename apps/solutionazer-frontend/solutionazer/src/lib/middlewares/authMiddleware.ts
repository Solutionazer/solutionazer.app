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

import { NextRequest, NextResponse } from 'next/server'
import { allowedModules } from '../module/moduleData'

export default function authMiddleware(req: NextRequest) {
  console.log('SE ENTRA EN AUTH MIDDLEWARE')

  const { pathname } = req.nextUrl

  const token = req.cookies.get('accessToken')?.value
  const isAuthenticated = !!token

  const isPublicPath = pathname === '/login' || pathname === '/register'
  const isProtectedPath =
    pathname.startsWith('/forms') ||
    allowedModules.includes(pathname.split('/')[1])

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/forms', req.url))
  }

  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
