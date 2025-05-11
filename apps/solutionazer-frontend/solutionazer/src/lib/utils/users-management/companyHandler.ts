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

import Admin from '@/lib/auth/companies/admins/admin'
import Member from '@/lib/auth/companies/members/member'

const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!

export const registerCompany = async (name: string, admins: object[]) => {
  const res = await fetch(`${baseUrl}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      admins,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const companyExists = async (userUuid: string) => {
  const res = await fetch(`${baseUrl}/companies/check/${userUuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getCompaniesByUser = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/companies/user/${uuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateCompany = async (uuid: string, name: string) => {
  const res = await fetch(`${baseUrl}/companies/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateAdmins = async (uuid: string, admins: Admin[]) => {
  const res = await fetch(`${baseUrl}/companies/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admins,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateMembers = async (uuid: string, members: Member[]) => {
  const res = await fetch(`${baseUrl}/companies/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      members,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
