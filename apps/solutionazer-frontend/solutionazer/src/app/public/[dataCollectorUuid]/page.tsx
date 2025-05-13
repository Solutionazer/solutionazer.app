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

/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import Section from '@/components/shared/containers/Section'
import Button from '@/components/shared/form/components/Button'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import Title from '@/components/shared/titles/Title'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import Question from '@/lib/module/data-collectors/questions/question'
import QuestionType from '@/lib/module/data-collectors/questions/questionType'
import { getPublicForm } from '@/lib/utils/data-collectors/formsHandler'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PublicDataCollector() {
  // router
  const urlParams = useParams()

  // dataCollector uuid
  const uuid: string = urlParams.dataCollectorUuid as string

  // dataCollector state
  const [dataCollector, setDataCollector] = useState<DataCollector | null>(null)

  // fetch public form
  useEffect(() => {
    if (uuid) {
      const fetchData = async () => {
        try {
          const dataCollectorData = await getPublicForm(uuid)

          console.log(dataCollectorData)

          const dataCollector: DataCollector = new DataCollector({
            title: dataCollectorData.title,
            description: dataCollectorData.description,
            type: dataCollectorData.type,
            isPublished: dataCollectorData.isPublished,
            questions: dataCollectorData.questions.map((question: any) => {
              return new Question({
                uuid: question.uuid,
                text: question.text,
                required: question.required,
                order: question.order,
                type: new QuestionType({
                  uuid: question.type.uuid,
                  name: question.type.name,
                  description: question.type.description,
                }),
              })
            }),
          })

          setDataCollector(dataCollector)
        } catch {}
      }

      fetchData()
    }
  }, [uuid])

  // questions states
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // 'onClick' | answer btn
  const handleAnswerClick = () => {
    setShowQuestions(true)
  }

  // 'onClick' | next btn
  const handleNextClick = () => {
    if (dataCollector) {
      if (
        currentQuestionIndex <
        (dataCollector.getQuestions() ?? []).length - 1
      ) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    }
  }

  // 'onClick' | back btn
  const handleBackClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  return (
    <Section>
      {!showQuestions ? (
        <>
          <Title
            params={{ text: dataCollector?.getTitle() ?? '', classNames: [] }}
          />
          <MediumTitle
            params={{
              text: dataCollector?.getDescription() ?? '',
              classNames: [],
            }}
          />
          <Button
            params={{
              type: ButtonType.Button,
              text: 'Answer',
              onClick: handleAnswerClick,
            }}
          />
        </>
      ) : (
        <>
          {dataCollector && (dataCollector.getQuestions() ?? []).length > 0 && (
            <>
              <Title
                params={{
                  text: (dataCollector.getQuestions() ?? [])[
                    currentQuestionIndex
                  ].getText(),
                  classNames: [],
                }}
              />
              <div>
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'Back',
                    onClick: handleBackClick,
                  }}
                />
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'Next',
                    onClick: handleNextClick,
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
    </Section>
  )
}
