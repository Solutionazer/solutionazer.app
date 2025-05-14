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

import LoginFailed from '@/lib/errors/loginFailed'
import LogoutFailed from '@/lib/errors/logoutFailed'

const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!

export const login = async (email: string, password: string) => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new LoginFailed()
  }

  return await res.json()
}

export const logout = async () => {
  const res = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new LogoutFailed()
  }
}
