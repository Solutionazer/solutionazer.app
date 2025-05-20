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
import { getPublicSurvey } from '@/lib/utils/data-collectors/surveysHandler'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import styles from './page.module.css'
import {
  getConfig,
  submitAnswer,
} from '@/lib/utils/data-collectors/questions/questionsHandler'
import Link from 'next/link'
import Input from '@/components/shared/form/components/Input'

import { v4 as uuidv4 } from 'uuid'

export default function PublicDataCollector() {
  // router
  const urlParams = useParams()

  // dataCollector uuid
  const uuid: string = urlParams.dataCollectorUuid as string
  const type: string = urlParams.dataCollectorType as string

  // dataCollector state
  const [dataCollector, setDataCollector] = useState<DataCollector | null>(null)

  // fetch public form
  useEffect(() => {
    if (uuid) {
      const fetchData = async () => {
        try {
          const dataCollectorData =
            type === 'form'
              ? await getPublicForm(uuid)
              : await getPublicSurvey(uuid)

          const dataCollector: DataCollector = new DataCollector({
            title: dataCollectorData.title,
            description: dataCollectorData.description,
            type: dataCollectorData.type,
            isPublished: dataCollectorData.isPublished,
            questions: dataCollectorData.questions
              .map((question: any) => {
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
              })
              .sort((a: any, b: any) => a.getOrder() - b.getOrder()),
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

  // session state
  const [sessionUuid, setSessionUuid] = useState<string | null>(null)

  // generate sessionUuid
  useEffect(() => {
    const uuid = uuidv4()
    setSessionUuid(uuid)
  }, [])

  // 'onClick' | next btn
  const handleNextClick = async () => {
    if (dataCollector) {
      const questions: Question[] = dataCollector.getQuestions() ?? []
      const currentQuestion: Question = questions[currentQuestionIndex]
      const questionType: string = currentQuestion?.getType()?.getName() ?? ''
      const questionUuid: string = currentQuestion?.getUuid() ?? ''

      let value: any = null

      switch (questionType) {
        case 'shortText':
          value = shortText
          break
        case 'longText':
          value = longText
          break
        case 'rating':
          value = rating
          break
        case 'email':
          value = email
          break
        case 'phone':
          value = phone
          break
        case 'date':
          value = date?.toISOString().split('T')[0]
          break
        case 'legal':
          value = true
          break
        default:
          value = null
      }

      try {
        if (value !== null && questionUuid && sessionUuid) {
          await submitAnswer(questionUuid, value, sessionUuid)
        }
      } catch (error) {
        console.error(error)
      }

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

  // config states
  const [questionConfig, setQuestionConfig] = useState<any | null>(null)

  // load config
  useEffect(() => {
    const fetchQuestionsConfig = async () => {
      if (dataCollector) {
        const currentQuestion =
          dataCollector.getQuestions()?.[currentQuestionIndex]

        const type: string = currentQuestion?.getType()?.getName() ?? ''
        const uuid: string = currentQuestion?.getUuid() ?? ''

        try {
          const config = await getConfig(type ?? '', uuid ?? '')

          setQuestionConfig(config)
        } catch {
          setQuestionConfig(null)
        }
      }
    }

    fetchQuestionsConfig()
  }, [dataCollector, currentQuestionIndex])

  // date state
  const [date, setDate] = useState<Date>()

  // email state
  const [email, setEmail] = useState<string>('')

  // phone state
  const [phone, setPhone] = useState<string>('')

  // shortText state
  const [shortText, setShortText] = useState<string>('')

  // longText state
  const [longText, setLongText] = useState<string>('')

  // rating state
  const [rating, setRating] = useState<number>(0)

  // render inputs
  const renderInput = (questionType: string) => {
    switch (questionType) {
      case 'welcome':
        return <p>{questionConfig?.description}</p>
      case 'legal':
        return (
          <div>
            <p>{questionConfig?.legalText}</p>
            <Input
              params={{
                type: 'checkbox',
                id: 'legal_checkbox',
                value: '',
                onChange: () => {},
                placeholder: '',
                required: questionConfig?.required ?? false,
                disabled: false,
              }}
            />
          </div>
        )
      case 'statement':
        return <p>{questionConfig?.content}</p>
      case 'website':
        return <Link href={`/${questionConfig?.url ?? ''}`}>Redirect</Link>
      case 'greetings':
        return <p>{questionConfig?.message}</p>
      case 'date': {
        const today: string = new Date().toISOString().split('T')[0]
        const allowPastDates: boolean = questionConfig?.allowPastDates ?? true
        const minFromConfig: string = questionConfig?.minDate ?? ''

        const minDate: string = !allowPastDates
          ? minFromConfig && minFromConfig > today
            ? minFromConfig
            : today
          : minFromConfig

        const maxDate: string = questionConfig?.maxDate ?? ''

        return (
          <Input
            params={{
              type: 'date',
              id: 'date',
              value: date ? date.toISOString().split('T')[0] : '',
              min: minDate,
              max: maxDate,
              onChange: (event) => {
                const selectedDate = event.target.value
                setDate(new Date(selectedDate))
              },
              placeholder: '',
              required: false,
              disabled: false,
            }}
          />
        )
      }
      case 'email':
        return (
          <Input
            params={{
              type: 'email',
              id: 'email',
              value: email,
              onChange: (event) => {
                setEmail(event.target.value)
              },
              placeholder: '',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'phone': {
        const countryCode: string = questionConfig?.countryCode ?? '+34'

        return (
          <div>
            <span>{countryCode}</span>

            <Input
              params={{
                type: 'tel',
                id: 'phone',
                value: phone,
                onChange: (event) => {
                  setPhone(event.target.value)
                },
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
          </div>
        )
      }
      case 'longText': {
        const characterLimit: number = questionConfig?.characterLimit ?? 500

        return (
          <div>
            <textarea
              id="long_text"
              value={longText}
              onChange={(event) => {
                if (event.target.value.length <= characterLimit) {
                  setLongText(event.target.value)
                }
              }}
            ></textarea>
            <p>{`${longText.length} / ${characterLimit}`}</p>
          </div>
        )
      }
      case 'shortText': {
        const characterLimit: number = questionConfig?.characterLimit ?? 100

        return (
          <div>
            <Input
              params={{
                type: 'text',
                id: 'short_text',
                value: shortText,
                onChange: (event) => {
                  if (event.target.value.length <= characterLimit) {
                    setShortText(event.target.value)
                  }
                },
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
            <p>{`${shortText.length} / ${characterLimit}`}</p>
          </div>
        )
      }
      case 'rating': {
        const max: number = questionConfig?.maxRating ?? 5
        const icon: string = questionConfig?.iconType ?? 'star'

        const getIcon = (filled: boolean) => {
          if (icon) {
            return filled ? '⭐' : '☆'
          }
        }

        return (
          <div>
            {[...Array(max)].map((_, i) => {
              const index = i + 1

              return (
                <span key={index} onClick={() => setRating(index)}>
                  {getIcon(index <= rating)}
                </span>
              )
            })}
          </div>
        )
      }
    }
  }

  return (
    <Section params={{ className: styles.container }}>
      {!showQuestions ? (
        <div className={styles.thumbnail}>
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
        </div>
      ) : (
        <>
          {dataCollector && (dataCollector.getQuestions() ?? []).length > 0 && (
            <div className={styles.question_container}>
              <Title
                params={{
                  text: (dataCollector.getQuestions() ?? [])[
                    currentQuestionIndex
                  ].getText(),
                  classNames: [],
                }}
              />
              {questionConfig &&
                renderInput(
                  (dataCollector.getQuestions() ?? [])[currentQuestionIndex]
                    .getType()
                    ?.getName() ?? '',
                )}
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
            </div>
          )}
        </>
      )}
    </Section>
  )
}
