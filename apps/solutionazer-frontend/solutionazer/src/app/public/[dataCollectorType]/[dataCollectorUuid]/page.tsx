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
import Message from '@/components/shared/messages/Message'

import jsPDF from 'jspdf'

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

  // message
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<string>('error')

  // handle next states
  const [answers, setAnswers] = useState<{ question: string; answer: any }[]>(
    [],
  )
  const [isFinished, setIsFinished] = useState(false)

  // 'onClick' | next btn
  const handleNextClick = async () => {
    if (!dataCollector) return

    const questions: Question[] = dataCollector.getQuestions() ?? []
    const currentQuestion: Question = questions[currentQuestionIndex]
    const questionType = currentQuestion.getType()?.getName() ?? ''
    const questionUuid = currentQuestion.getUuid() ?? ''
    const required = currentQuestion.getRequired()
    const config = questionConfig

    let value: any = null
    let isValid = true

    switch (questionType) {
      case 'shortText':
        value = shortText
        if (required && !value) isValid = false
        if (config?.characterLimit && value.length > config.characterLimit)
          isValid = false
        break
      case 'longText':
        value = longText
        if (required && !value) isValid = false
        if (config?.characterLimit && value.length > config.characterLimit)
          isValid = false
        break
      case 'rating':
        value = rating
        if (required && !value) isValid = false
        break
      case 'email':
        value = email
        if (required && !value) isValid = false
        break
      case 'phone':
        value = phone
        if (required && !value) isValid = false
        if (value && !/^\d{9,15}$/.test(value)) isValid = false
        break

      case 'date':
        value = date?.toISOString().split('T')[0]
        if (required && !value) isValid = false
        break
      case 'legal':
        value = legalAccepted
        if (required && !value) isValid = false
        break

      default:
        value = null
    }

    if (!isValid) {
      setMessageType('error')
      setInfoMessage('You must complete the required field properly.')
      return
    }

    try {
      if (value !== null && questionUuid && sessionUuid) {
        await submitAnswer(questionUuid, value, sessionUuid)

        setAnswers((prev) => [
          ...prev,
          { question: currentQuestion.getText(), answer: value },
        ])

        setMessageType('successfully')
        setInfoMessage('Answer submitted successfully!')
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setIsFinished(true)
      }
    } catch (error) {
      console.error(error)
      setMessageType('error')
      setInfoMessage('There was an error submitting your answer.')
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

  // legal state
  const [legalAccepted, setLegalAccepted] = useState<boolean>(false)

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
        return (
          <p style={{ padding: '0 1rem 1rem 1rem', textAlign: 'center' }}>
            {questionConfig?.description}
          </p>
        )
      case 'legal':
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 1rem 1rem 1rem',
            }}
          >
            <p style={{ flexGrow: '1', paddingRight: '0.5rem' }}>
              {questionConfig?.legalText}
            </p>
            <Input
              params={{
                type: 'checkbox',
                id: 'legal_checkbox',
                value: '',
                onChange: (e) => setLegalAccepted(e.target.checked),
                placeholder: '',
                required: questionConfig?.required ?? false,
                disabled: false,
              }}
            />
          </div>
        )
      case 'statement':
        return (
          <p style={{ padding: '1rem', textAlign: 'center' }}>
            {questionConfig?.content}
          </p>
        )
      case 'website':
        return (
          <Link
            href={`/${questionConfig?.url ?? ''}`}
            style={{
              padding: '0.5rem 2rem',
              textDecoration: 'none',
              backgroundColor: 'var(--foreground-color)',
              color: 'var(--background-color)',
              fontWeight: '700',
              margin: '1rem',
              borderRadius: '8px',
            }}
          >
            Go to...
          </Link>
        )
      case 'greetings':
        return (
          <p style={{ padding: '1rem', textAlign: 'center' }}>
            {questionConfig?.message}
          </p>
        )
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
          <div style={{ padding: '1rem' }}>
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
          </div>
        )
      }
      case 'email':
        return (
          <div style={{ padding: '1rem' }}>
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
          </div>
        )
      case 'phone': {
        const countryCode: string = questionConfig?.countryCode ?? '+34'

        return (
          <div style={{ padding: '1rem' }}>
            <span
              style={{
                backgroundColor: 'var(--foreground-color)',
                color: 'var(--background-color)',
                marginRight: '0.5rem',
                borderRadius: '4px',
                fontWeight: '700',
                padding: '0.25rem',
              }}
            >
              {countryCode}
            </span>

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
          <div style={{ padding: '1rem' }}>
            <textarea
              id="long_text"
              value={longText}
              onChange={(event) => {
                if (event.target.value.length <= characterLimit) {
                  setLongText(event.target.value)
                }
              }}
              cols={50}
              rows={9}
            ></textarea>
            <p>{`${longText.length} / ${characterLimit}`}</p>
          </div>
        )
      }
      case 'shortText': {
        const characterLimit: number = questionConfig?.characterLimit ?? 100

        return (
          <div style={{ padding: '1rem' }}>
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
          <div style={{ padding: '1rem' }}>
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

  // 'onCLick' | generate PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()

    const center = (
      text: string,
      y: number,
      fontSize = 16,
      weight: 'normal' | 'bold' = 'normal',
    ) => {
      doc.setFont('helvetica', weight)
      doc.setFontSize(fontSize)
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      doc.text(text, x, y)
    }

    doc.setTextColor(40, 40, 40)

    center('Form completed', 88, 26, 'bold')
    center('Summary of answers', 130, 14, 'bold')

    let y = 180

    answers.forEach((ans, idx) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text(`${idx + 1}. ${ans.question}`, 60, y)
      y += 20

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)

      const answerText =
        typeof ans.answer === 'string' || typeof ans.answer === 'number'
          ? String(ans.answer)
          : Array.isArray(ans.answer)
            ? ans.answer.join(', ')
            : JSON.stringify(ans.answer)

      const splitText = doc.splitTextToSize(answerText, pageWidth - 120)
      doc.text(splitText, 80, y)
      y += splitText.length * 16 + 10
    })

    // Pie de página
    doc.setFontSize(10)
    center(
      `Generated on ${new Date().toLocaleDateString()} by solutionazer.app`,
      540,
      10,
    )

    doc.save('solutionazer-answers.pdf')
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
      ) : isFinished ? (
        <div className={styles.finished_container}>
          <Title
            params={{ text: 'Thanks for your answers!', classNames: [] }}
          />
          <ul>
            {answers.map((ans, idx) => (
              <li key={idx}>
                <strong>{ans.question}</strong>: {String(ans.answer)}
              </li>
            ))}
          </ul>
          <div>
            <Button
              params={{
                type: ButtonType.Button,
                text: 'Download',
                onClick: handleDownloadPDF,
              }}
            />
            <Button
              params={{
                type: ButtonType.Button,
                text: 'Answer again',
                onClick: () => {
                  window.location.reload()
                },
              }}
            />
          </div>
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
              {infoMessage && (
                <Message params={{ type: messageType, text: infoMessage }} />
              )}
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
                    text:
                      currentQuestionIndex ===
                      (dataCollector.getQuestions()?.length ?? 1) - 1
                        ? 'Finish'
                        : 'Next',
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
