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

import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import styles from './canvas.module.css'
import Question from '@/lib/module/data-collectors/questions/question'
import Input from '@/components/shared/form/components/Input'
import Article from '@/components/shared/containers/Article'
import { useEffect, useState } from 'react'
import {
  getConfig,
  getQuestionsByForm,
  getQuestionsBySurvey,
  updateLegalConfig,
  updateStatementConfig,
  updateText,
  updateWelcomeScreenConfig,
} from '@/lib/utils/data-collectors/questions/questionsHandler'
import Option from '@/lib/options/option'
import Select from '@/components/shared/form/components/Select'
import Image from 'next/image'
import QuestionType from '@/lib/module/data-collectors/questions/questionType'
import DataCollector from '@/lib/module/data-collectors/dataCollector'

export default function Canvas() {
  // dataCollector global state
  const { dataCollector, selectedQuestionUuid } = useDataCollector()

  // questions state
  const [questions, setQuestions] = useState<Question[]>([])

  // load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!dataCollector) return

      const dataCollectorAny: any = dataCollector

      const instance: DataCollector = new DataCollector({
        uuid: dataCollectorAny.uuid,
        title: dataCollectorAny.title,
        description: dataCollectorAny.description,
        type: dataCollectorAny.type,
        isPublished: dataCollectorAny.isPublished,
        createdAt: dataCollectorAny.createdAt,
        updatedAt: dataCollectorAny.updatedAt,
      })

      const uuid: string = instance.getUuid() ?? ''
      const type: string = instance.getType() ?? ''

      const fetchedQuestions =
        type === 'form'
          ? await getQuestionsByForm(uuid)
          : await getQuestionsBySurvey(uuid)

      setQuestions(
        fetchedQuestions.map(
          (question: any) =>
            new Question({
              uuid: question.uuid,
              text: question.text,
              required: question.required,
              order: question.order,
              type: new QuestionType({
                uuid: question.type.uuid,
                name: question.type.name,
                description: question.type.description,
              }),
            }),
        ),
      )
    }

    fetchQuestions()
  }, [dataCollector])

  // selected question
  const selectedQuestion: Question | undefined = questions.find(
    (question) => question.getUuid() === selectedQuestionUuid,
  )

  // config states
  const [questionConfig, setQuestionConfig] = useState<any | null>(null)

  // load config
  useEffect(() => {
    const fetchQuestionsConfig = async () => {
      if (selectedQuestion) {
        const type = selectedQuestion.getType()?.getName()
        const uuid = selectedQuestion.getUuid()

        try {
          const config = await getConfig(type ?? '', uuid ?? '')

          setQuestionConfig(config)
        } catch {}
      }
    }

    fetchQuestionsConfig()
  }, [selectedQuestion])

  // synchronize configs
  useEffect(() => {
    if (!selectedQuestion || !questionConfig) return

    const type = selectedQuestion.getType()?.getName()

    if (type === 'welcome') {
      setQuestionText(questionConfig.headline ?? '')
      setWelcomeDescription(questionConfig.description ?? '')
    } else if (type === 'legal') {
      setQuestionText(selectedQuestion.getText())
      setLegalText(questionConfig.legalText ?? '')
    } else if (type === 'statement') {
      setQuestionText(selectedQuestion.getText())
      setStatementContent(questionConfig.content ?? '')
    } else {
      setQuestionText(selectedQuestion.getText())
    }
  }, [questionConfig, selectedQuestion])

  // question state
  const [questionText, setQuestionText] = useState<string>(
    selectedQuestion?.getType()?.getName() === 'welcome'
      ? (questionConfig?.headline ?? '')
      : (selectedQuestion?.getText() ?? ''),
  )

  // welcome state
  const [welcomeDescription, setWelcomeDescription] = useState<string>(
    questionConfig?.description ?? '',
  )

  // legal state
  const [legalText, setLegalText] = useState<string>(
    questionConfig?.legalText ?? '',
  )

  // rating state
  const [rating, setRating] = useState<number>(0)

  // scale state
  const [scaleValue, setScaleValue] = useState<number>(0)

  // shortText state
  const [shortText, setShortText] = useState<string>('')

  // statement state
  const [statementContent, setStatementContent] = useState<string>(
    questionConfig?.content ?? '',
  )

  // website state
  const [websiteUrl, setWebsiteUrl] = useState<string>('')

  // yesNo state
  /*
  const [yesNoValue, setYesNoValue] = useState<boolean>(
    questionConfig?.defaultValue ?? false,
  )
  */

  // greetings states
  const [greetingsMessage, setGreetingsMessage] = useState<string>(
    questionConfig?.message ?? '',
  )
  /*
  const [greetingsRedirect, setGreetingsRedirect] = useState<string>(
    questionConfig?.redirectUrl,
  )
  */

  // longText state
  const [longText, setLongText] = useState<string>('')

  // update welcomeScreenConfig
  useEffect(() => {
    if (
      !selectedQuestion ||
      selectedQuestion.getType()?.getName() !== 'welcome'
    )
      return

    const uuid: string = questionConfig?.uuid ?? ''
    const initialHeadline: string = questionConfig?.headline ?? ''
    const initialDescription: string = questionConfig?.description ?? ''

    const timeout = setTimeout(() => {
      if (
        questionText !== initialHeadline ||
        welcomeDescription !== initialDescription
      ) {
        updateWelcomeScreenConfig(uuid, questionText, welcomeDescription)
          .then(() => console.log('Welcome config updated'))
          .catch((error) =>
            console.error('Error updating welcome config: ' + error),
          )
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [
    questionText,
    welcomeDescription,
    selectedQuestion,
    questionConfig?.uuid,
    questionConfig?.headline,
    questionConfig?.description,
  ])

  // update legalText
  useEffect(() => {
    if (!selectedQuestion || selectedQuestion.getType()?.getName() !== 'legal')
      return
    if (!questionConfig) return

    const uuid: string = questionConfig?.uuid ?? ''
    const initialLegalText: string = questionConfig.legalText ?? ''

    const timeout = setTimeout(() => {
      if (legalText !== initialLegalText) {
        updateLegalConfig(uuid, legalText)
          .then(() => console.log('Legal config updated'))
          .catch((error) => console.error(error))
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [legalText, selectedQuestion, questionConfig])

  // update statementContent
  useEffect(() => {
    if (
      !selectedQuestion ||
      selectedQuestion.getType()?.getName() !== 'statement'
    )
      return
    if (!questionConfig) return

    const uuid: string = questionConfig?.uuid ?? ''
    const initialContent: string = questionConfig?.content ?? ''

    const timeout = setTimeout(() => {
      if (statementContent !== initialContent) {
        updateStatementConfig(uuid, statementContent)
          .then(() => console.log('Statement config updated'))
          .catch((error) => console.error(error))
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [statementContent, selectedQuestion, questionConfig])

  // hasInitialized state
  const [hasInitialized, setHasInitialized] = useState<boolean>(false)

  // update inputs
  useEffect(() => {
    if (!selectedQuestion || !questionText) return

    if (!hasInitialized) {
      setHasInitialized(true)

      const isNewWelcome: boolean =
        selectedQuestion.getType()?.getName() === 'welcome'

      if (isNewWelcome) {
        const uuid: string = selectedQuestion.getUuid() ?? ''
        const originalText: string = questionConfig?.headline ?? ''

        if (questionText !== originalText) {
          updateText(uuid, questionText)
            .then(() => console.log('Forced welcome text update'))
            .catch((error) => console.log('Error updating text: ' + error))
        }
      }

      return
    }

    const uuid: string = selectedQuestion.getUuid() ?? ''
    const type: string = selectedQuestion.getType()?.getName() ?? ''

    let defaultText: string = selectedQuestion.getText()

    if (type === 'welcome') {
      defaultText = questionConfig?.headline ?? ''
    } else if (type === 'legal') {
      defaultText = questionConfig?.legalText ?? ''
    }

    if (questionText === defaultText) return

    const timeout = setTimeout(() => {
      updateText(uuid ?? '', questionText)
        .then(() => console.log('Text updated successfully'))
        .catch((error) => console.error('Error updating text: ' + error))
    }, 500)

    return () => clearTimeout(timeout)
  }, [questionText, selectedQuestion])

  // render input
  const renderInput = () => {
    if (selectedQuestion) {
      const type = selectedQuestion.getType()?.getName()

      console.log(type)
      console.log(questionConfig)

      switch (type) {
        case 'welcome':
          return (
            <textarea
              id="welcome_description"
              value={welcomeDescription}
              onChange={(event) => setWelcomeDescription(event.target.value)}
            ></textarea>
          )
        case 'legal':
          return (
            <div>
              <Input
                params={{
                  type: 'text',
                  id: 'legal_text',
                  value: legalText,
                  onChange: (event) => {
                    setLegalText(event.target.value)
                  },
                  placeholder: '',
                  required: false,
                  disabled: false,
                }}
              />
              <Input
                params={{
                  type: 'checkbox',
                  id: 'legal_check',
                  value: '',
                  onChange: () => {},
                  placeholder: '',
                  required: questionConfig?.required ?? false,
                  disabled: false,
                }}
              />
            </div>
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
            <Input
              params={{
                type: 'date',
                id: 'date',
                value: '',
                min: minDate,
                max: maxDate,
                onChange: () => {},
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
          )
        }
        case 'dropdown': {
          let optionsArray = questionConfig?.options ?? []

          if (questionConfig?.randomizeOptions) {
            optionsArray = [...optionsArray].sort(() => Math.random() - 0.5)
          }

          const options: Option[] = optionsArray.map(
            (option: string, index: number) => {
              return new Option(++index, option)
            },
          )

          return (
            <Select
              params={{
                id: 'dropdown',
                options,
                value: '',
                onChange: () => {},
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
                value: '',
                onChange: () => {},
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
          )
        case 'file': {
          const allowedTypes: string =
            questionConfig?.allowFileType?.join(',') ?? ''

          const maxFileSize: number = questionConfig?.maxFileSize ?? 5242880

          const handleFileChange = (
            event: React.ChangeEvent<HTMLInputElement>,
          ) => {
            const file = event.target.files?.[0]

            if (file) {
              if (file.size > maxFileSize) {
                event.target.value = ''
              }
            }
          }

          return (
            <Input
              params={{
                type: 'file',
                id: 'file',
                accept: allowedTypes,
                value: '',
                onChange: handleFileChange,
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
          )
        }
        case 'multipleChoice': {
          const options: string[] = [...(questionConfig?.option ?? [])]

          if (questionConfig?.randomizeOptions) {
            options.sort(() => Math.random() - 0.5)
          }

          const isMultiple: boolean =
            questionConfig?.allowMultipleAnswers ?? false

          return (
            <>
              {options.map((option: string, index: number) => {
                return (
                  <Input
                    key={index}
                    params={{
                      type: isMultiple ? 'checkbox' : 'radio',
                      id: 'multiple_choice',
                      value: option,
                      onChange: () => {},
                      placeholder: '',
                      required: false,
                      disabled: false,
                    }}
                  />
                )
              })}
            </>
          )
        }
        case 'phone': {
          const countryCode: string = questionConfig?.countryCode ?? '+34'

          return (
            <div>
              <span>{countryCode}</span>

              <Input
                params={{
                  type: 'tel',
                  id: 'phone',
                  value: '',
                  onChange: () => {},
                  placeholder: '',
                  required: false,
                  disabled: false,
                }}
              />
            </div>
          )
        }
        case 'picture': {
          const options = [...(questionConfig?.options ?? [])]

          if (questionConfig?.randomizeOptions) {
            options.sort(() => Math.random() - 0.5)
          }

          const isMultiple: boolean =
            questionConfig?.allowMultipleSelection ?? false

          return (
            <div>
              {options.map((option: string, index: number) => (
                <>
                  <Input
                    key={index}
                    params={{
                      type: isMultiple ? 'checkbox' : 'radio',
                      id: 'picture_input',
                      value: '',
                      onChange: () => {},
                      placeholder: '',
                      required: false,
                      disabled: false,
                    }}
                  />
                  <Image key={index} src={option} alt="" />
                </>
              ))}
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

        case 'scale': {
          const min: number = questionConfig?.minValue ?? 1
          const max: number = questionConfig?.maxValue ?? 5
          const step: number = questionConfig?.step ?? 1
          const labels: string[] = questionConfig?.labels ?? []

          return (
            <div>
              <Input
                params={{
                  type: 'range',
                  id: 'scale',
                  min,
                  max,
                  step,
                  value: scaleValue,
                  onChange: (event) =>
                    setScaleValue(Number(event.target.value)),
                  placeholder: '',
                  required: false,
                  disabled: false,
                }}
              />
              <div>
                {labels.length === 2 ? (
                  <>
                    <span>{labels[0]}</span>
                    <span>{labels[1]}</span>
                  </>
                ) : labels.length > 0 ? (
                  labels.map((label: string, index: number) => (
                    <span key={index}>{label}</span>
                  ))
                ) : (
                  <>
                    <span>{min}</span>
                    <span>{max}</span>
                  </>
                )}
              </div>
              <p>Selected Value: {scaleValue}</p>
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
        case 'statement': {
          return (
            <textarea
              id="statement"
              value={statementContent}
              onChange={(event) => {
                setStatementContent(event.target.value)
              }}
            />
          )
        }
        case 'website':
          return (
            <Input
              params={{
                type: 'url',
                id: 'website',
                value: websiteUrl,
                onChange: (event) => {
                  setWebsiteUrl(event.target.value)
                },
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
          )
        case 'yesNo':
          return <div></div>
        case 'greetings':
          return (
            <div>
              <textarea
                id="greetings_message"
                value={greetingsMessage}
                onChange={(event) => setGreetingsMessage(event.target.value)}
              ></textarea>
            </div>
          )
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
      }
    }
  }

  return (
    <div className={styles.canvas}>
      <Article>
        {selectedQuestion && (
          <Input
            params={{
              type: 'text',
              id: 'question_text',
              value: questionText,
              onChange: (event) => {
                setQuestionText(event.target.value)
              },
              placeholder: '',
              required: false,
              disabled: false,
            }}
          />
        )}
      </Article>
      <Article>{selectedQuestion && renderInput()}</Article>
    </div>
  )
}
