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

export const getAllQuestionTypes = async () => {
  const res = await fetch(`${baseUrl}/questions/types`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getQuestionsByForm = async (formUuid: string) => {
  const res = await fetch(`${baseUrl}/questions/form/${formUuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getQuestionsBySurvey = async (formUuid: string) => {
  const res = await fetch(`${baseUrl}/questions/survey/${formUuid}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const createQuestion = async (
  dataCollectorUuid: string,
  type: string,
  order: number,
) => {
  const res = await fetch(`${baseUrl}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataCollectorUuid,
      type,
      order,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const deleteQuestion = async (uuid: string) => {
  const res = await fetch(`${baseUrl}/questions/${uuid}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getConfig = async (configType: string, questionUuid: string) => {
  const res = await fetch(
    `${baseUrl}/questions/config/${configType}/${questionUuid}`,
    {
      method: 'GET',
    },
  )

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateText = async (uuid: string, text: string) => {
  const res = await fetch(`${baseUrl}/questions/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateWelcomeScreenConfig = async (
  uuid: string,
  headline: string,
  description: string,
) => {
  const res = await fetch(`${baseUrl}/questions/welcome/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      headline,
      description,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateLegalConfig = async (uuid: string, legalText: string) => {
  const res = await fetch(`${baseUrl}/questions/legal/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      legalText,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateStatementConfig = async (uuid: string, content: string) => {
  const res = await fetch(`${baseUrl}/questions/statement/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(await res.json())
  }

  return await res.json()
}

export const updateGreetingsScreenConfig = async (
  uuid: string,
  message: string,
) => {
  const res = await fetch(`${baseUrl}/questions/greetings/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const updateWebsiteConfig = async (uuid: string, url: string) => {
  const res = await fetch(`${baseUrl}/questions/website/${uuid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const submitAnswer = async (
  questionUuid: string,
  value: string | number | boolean | string[],
  sessionUuid: string,
) => {
  const res = await fetch(`${baseUrl}/questions/submit-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionUuid,
      sessionUuid,
      value,
    }),
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}

export const getAnswers = async () => {
  const res = await fetch(`${baseUrl}/questions/answers`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error((await res.json()).message)
  }

  return await res.json()
}
