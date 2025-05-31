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

'use client'

import { JSX, use, useEffect, useState } from 'react'

import useAuthStore from '@/lib/auth/states/global/authStore'
import {
  createForm,
  deleteForm,
  getForms,
} from '@/lib/utils/data-collectors/formsHandler'
import {
  createSurvey,
  deleteSurvey,
  getSurveys,
} from '@/lib/utils/data-collectors/surveysHandler'

import styles from './page.module.css'
import Button from '@/components/shared/form/components/Button'
import Modal from '@/components/shared/containers/modal/Modal'
import Article from '@/components/shared/containers/Article'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import useSearch from '@/lib/module/states/global/searchStore'
import Card from '@/components/users/module/card/Card'

interface ModuleProps {
  params: Promise<{
    module: string
  }>
}

export default function Module(props: Readonly<ModuleProps>) {
  // props
  const { module } = use(props.params)

  // modal state
  const [showModal, setShowModal] = useState(false)

  // 'onClick' create btn
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // create form or survey btn
  const createBtn: JSX.Element = (
    <Button
      params={{
        text: 'Create',
        className: styles.btn,
        onClick: handleModalVisibility,
      }}
    />
  )

  // context
  const isForms: boolean = module === 'forms'

  const isSurveys: boolean = module === 'surveys'
  const isSurveysResult: JSX.Element | null = isSurveys ? createBtn : null

  // auth global state
  const { user } = useAuthStore()

  // search global state
  const { searchInput } = useSearch()

  // forms state
  const [forms, setForms] = useState<DataCollector[]>([])

  // surveys state
  const [surveys, setSurveys] = useState<DataCollector[]>([])

  // fetch forms and surveys
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userUuid: string = user.getUuid() ?? ''

        let fetchedForms: DataCollector[]
        let fetchedSurveys: DataCollector[]

        if (isForms) {
          fetchedForms = (await getForms(userUuid)).map(
            (form: {
              uuid: string
              title: string
              description: string
              type: string
              userUuid: string
              isPublished: boolean
              updatedAt: string
              createdAt: string
            }) => {
              return new DataCollector({
                uuid: form.uuid,
                title: form.title,
                description: form.description,
                type: form.type,
                userUuid: form.userUuid,
                isPublished: form.isPublished,
                updatedAt: new Date(form.updatedAt),
                createdAt: new Date(form.updatedAt),
              })
            },
          )

          setForms(fetchedForms)
        } else if (isSurveys) {
          fetchedSurveys = (await getSurveys(userUuid)).map(
            (survey: {
              uuid: string
              title: string
              description: string
              type: string
              userUuid: string
              isPublished: boolean
              updatedAt: string
              createdAt: string
            }) => {
              return new DataCollector({
                uuid: survey.uuid,
                title: survey.title,
                description: survey.description,
                type: survey.type,
                userUuid: survey.userUuid,
                isPublished: survey.isPublished,
                updatedAt: new Date(survey.updatedAt),
                createdAt: new Date(survey.createdAt),
              })
            },
          )

          setSurveys(fetchedSurveys)
        }
      }
    }

    fetchData()
  }, [user, isForms, isSurveys])

  // filter by searchInput value
  const filteredForms: DataCollector[] = forms.filter((form) => {
    const title: string = form.getTitle()?.toLowerCase() ?? ''
    const description: string = form.getDescription()?.toLowerCase() ?? ''

    const query: string = searchInput.toLowerCase()

    return title.includes(query) || description.includes(query)
  })

  const filteredSurveys: DataCollector[] = surveys.filter((survey) => {
    const title: string = survey.getTitle()?.toLowerCase() ?? ''
    const description: string = survey.getDescription()?.toLowerCase() ?? ''

    const query: string = searchInput.toLowerCase()

    return title.includes(query) || description.includes(query)
  })

  // order by updatedAt
  const sortedForms: DataCollector[] = filteredForms.sort(
    (firstForm, secondForm) => {
      const firstFormUpdatedAt: number =
        firstForm.getUpdatedAt()?.getTime() ?? 0
      const secondFormUpdatedAt: number =
        secondForm.getUpdatedAt()?.getTime() ?? 0

      if (firstFormUpdatedAt !== secondFormUpdatedAt) {
        return secondFormUpdatedAt - firstFormUpdatedAt
      }

      const firstFormCreatedAt: number =
        firstForm.getCreatedAt()?.getTime() ?? 0
      const secondFormCreatedAt: number =
        secondForm.getCreatedAt()?.getTime() ?? 0

      return secondFormCreatedAt - firstFormCreatedAt
    },
  )

  const sortedSurveys: DataCollector[] = filteredSurveys.sort(
    (firstSurvey, secondSurvey) => {
      const firstSurveyUpdatedAt: number =
        firstSurvey.getUpdatedAt()?.getTime() ?? 0
      const secondSurveyUpdatedAt: number =
        secondSurvey.getUpdatedAt()?.getTime() ?? 0

      if (firstSurveyUpdatedAt !== secondSurveyUpdatedAt) {
        return secondSurveyUpdatedAt - firstSurveyUpdatedAt
      }

      const firstSurveyCreatedAt: number =
        firstSurvey.getCreatedAt()?.getTime() ?? 0
      const secondSurveyCreatedAt: number =
        secondSurvey.getCreatedAt()?.getTime() ?? 0

      return secondSurveyCreatedAt - firstSurveyCreatedAt
    },
  )

  // in development message
  const underDevelopment = (
    <p className={styles.under_development_message}>
      This section is under development
    </p>
  )

  // pages depend on the context
  const ModulePages: Record<string, JSX.Element> = {
    forms: (
      <>
        {sortedForms.length === 0 && (
          <p style={{ textAlign: 'center' }}>No forms found.</p>
        )}
        {sortedForms.map((form) => (
          <li key={form.getUuid()}>
            <Card
              key={form.getUuid()}
              params={{
                form,
                onDelete: () =>
                  handleDataCollectorsDeletion(form.getUuid() ?? ''),
              }}
            />
          </li>
        ))}
      </>
    ),
    surveys: (
      <>
        {sortedSurveys.length === 0 && (
          <p style={{ textAlign: 'center' }}>No surveys found.</p>
        )}
        {sortedSurveys.map((survey) => (
          <li key={survey.getUuid()}>
            <Card
              key={survey.getUuid()}
              params={{
                survey,
                onDelete: () =>
                  handleDataCollectorsDeletion(survey.getUuid() ?? ''),
              }}
            />
          </li>
        ))}
      </>
    ),
    interviews: underDevelopment,
    glossaries: underDevelopment,
    'doc.-anl.': underDevelopment,
  }

  // handle forms and surveys creation
  const handleDataCollectorsCreation = async () => {
    let newItem: {
      uuid: string
      title: string
      description: string
      type: string
      userUuid: string
      isPublished: boolean
      updatedAt: string
      createdAt: string
    }

    if (isForms) {
      newItem = await createForm(user?.getUuid() ?? '')

      const newDataCollector: DataCollector = new DataCollector({
        uuid: newItem.uuid,
        title: newItem.title,
        description: newItem.description,
        type: newItem.type,
        userUuid: newItem.userUuid,
        isPublished: newItem.isPublished,
        updatedAt: new Date(newItem.updatedAt),
        createdAt: new Date(newItem.createdAt),
      })

      setForms((prev) => [newDataCollector, ...prev])
    } else {
      newItem = await createSurvey(user?.getUuid() ?? '')

      const newDataCollector: DataCollector = new DataCollector({
        uuid: newItem.uuid,
        title: newItem.title,
        description: newItem.description,
        type: newItem.type,
        userUuid: newItem.userUuid,
        isPublished: newItem.isPublished,
        updatedAt: new Date(newItem.updatedAt),
        createdAt: new Date(newItem.createdAt),
      })

      setSurveys((prev) => [newDataCollector, ...prev])
    }

    setShowModal(false)
  }

  // handle forms and surveys deletion
  const handleDataCollectorsDeletion = async (uuid: string) => {
    if (isForms) {
      try {
        await deleteForm(uuid)

        setForms((prev) => prev.filter((form) => form.getUuid() !== uuid))
      } catch {}
    } else {
      try {
        await deleteSurvey(uuid)

        setSurveys((prev) => prev.filter((survey) => survey.getUuid() !== uuid))
      } catch {}
    }
  }

  return (
    <>
      <ul className={styles.content}>{ModulePages[module]}</ul>
      {showModal && (
        <Modal params={{ setShowModal }}>
          <Article params={{ onClick: handleDataCollectorsCreation }}>
            <p>Empty</p>
          </Article>
        </Modal>
      )}
      {isForms ? createBtn : isSurveysResult}
    </>
  )
}
