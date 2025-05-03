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
import Card from '../../../components/module/card/Card'

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
import DataCollector from '@/lib/data-collectors/dataCollector'

interface ModuleProps {
  params: {
    module: string
  }
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
            }) => {
              return new DataCollector({
                uuid: form.uuid,
                title: form.title,
                description: form.description,
                type: form.type,
                userUuid: form.userUuid,
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
            }) => {
              return new DataCollector({
                uuid: survey.uuid,
                title: survey.title,
                description: survey.description,
                type: survey.type,
                userUuid: survey.userUuid,
              })
            },
          )

          setSurveys(fetchedSurveys)
        }
      }
    }

    fetchData()
  }, [user, isForms, isSurveys])

  // pages depend on the context
  const ModulePages: Record<string, JSX.Element> = {
    forms: (
      <>
        {forms.map((form) => (
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
        {surveys.map((survey) => (
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
  }

  // handle forms and surveys creation
  const handleDataCollectorsCreation = async () => {
    let newItem: {
      uuid: string
      title: string
      description: string
      type: string
      userUuid: string
    }

    if (isForms) {
      newItem = await createForm(user?.getUuid() ?? '')

      const newDataCollector: DataCollector = new DataCollector({
        uuid: newItem.uuid,
        title: newItem.title,
        description: newItem.description,
        type: newItem.type,
        userUuid: newItem.userUuid,
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
