const baseUrl: string =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''

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
