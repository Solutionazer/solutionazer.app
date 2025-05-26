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

const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!

export const registerUser = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const res = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName,
      email,
      password,
    }),
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const userExists = async (email: string) => {
  const res = await fetch(`${baseUrl}/users/email/${email}`)

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateUser = async (
  uuid: string,
  fullName: string,
  email: string,
) => {
  const res = await fetch(`${baseUrl}/users/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName,
      email,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const searchUsers = async (query: string, excludedUuids: string[]) => {
  const res = await fetch(
    `${baseUrl}/users/search?query=${query}&exclude=${excludedUuids.join(',')}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const searchUsersInCompany = async (
  companyUuid: string,
  query: string,
  excludedUuids?: string[],
) => {
  const res = await fetch(
    `${baseUrl}/users/search-in-company?company=${companyUuid}&query=${query}&exclude=${excludedUuids?.join(',')}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const searchUsersInSameTeam = async (
  userUuid: string,
  query: string,
  excludedUuids?: string[],
) => {
  const res = await fetch(
    `${baseUrl}/users/search-in-same-teams?user=${userUuid}&query=${query}&exclude=${excludedUuids?.join(',')}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
