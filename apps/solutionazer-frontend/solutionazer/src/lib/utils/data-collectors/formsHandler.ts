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

export const getForms = async (userUuid: string) => {
  const res = await fetch(`${baseUrl}/forms/${userUuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const createForm = async (userUuid: string) => {
  const res = await fetch(`${baseUrl}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userUuid,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateFormTitle = async (formUuid: string, title: string) => {
  const res = await fetch(`${baseUrl}/forms/${formUuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateFormDescription = async (
  formUuid: string,
  description: string,
) => {
  const res = await fetch(`${baseUrl}/forms/${formUuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteForm = async (formUuid: string) => {
  const res = await fetch(`${baseUrl}/forms/${formUuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const publishForm = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/forms/${uuid}`, {
    method: 'PATCH',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getPublicForm = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/forms/public/${uuid}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
