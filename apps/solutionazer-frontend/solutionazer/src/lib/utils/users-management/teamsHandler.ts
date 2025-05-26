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

export const getTeamsByUser = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/teams/user/${uuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getTeamsByCompany = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/teams/company/${uuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const createFreelanceTeam = async (name: string, owner: string) => {
  const res = await fetch(`${baseUrl}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      owner,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const createCompanyTeam = async (
  name: string,
  company: string,
  members: {
    uuid: string
    fullName: string
    email: string
  }[],
) => {
  const res = await fetch(`${baseUrl}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      company,
      members,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateTeamTitle = async (uuid: string, name: string) => {
  const res = await fetch(`${baseUrl}/teams/${uuid}`, {
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

export const updateTeamMembers = async (
  uuid: string,
  members: {
    uuid: string
    fullName: string
    email: string
  }[],
) => {
  const res = await fetch(`${baseUrl}/teams/${uuid}`, {
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

export const deleteTeam = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/teams/${uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
