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

import Footer from '@/components/shared/containers/Footer'

import styles from './toolsFooter.module.css'
import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { useEffect, useState } from 'react'
import Question from '@/lib/module/data-collectors/questions/question'
import {
  createQuestion,
  deleteQuestion,
  getAllQuestionTypes,
  getQuestionsByForm,
  getQuestionsBySurvey,
} from '@/lib/utils/data-collectors/questions/questionsHandler'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import Modal from '@/components/shared/containers/modal/Modal'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Article from '@/components/shared/containers/Article'
import QuestionType from '@/lib/module/data-collectors/questions/questionType'
import {
  splitCamelCaseAndCapitalize,
  toCamelCase,
} from '@/lib/utils/textHandler'
import { publishForm } from '@/lib/utils/data-collectors/formsHandler'
import { publishSurvey } from '@/lib/utils/data-collectors/surveysHandler'
import Message from '@/components/shared/messages/Message'
import Input from '@/components/shared/form/components/Input'

export default function ToolsFooter() {
  // dataCollector global state
  const {
    dataCollector,
    setDataCollector,
    selectedQuestionUuid,
    setSelectedQuestionUuid,
  } = useDataCollector()

  //  has questions loading been done?
  const [hasLoadedQuestions, setHasLoadedQuestions] = useState(false)

  // fetch questions
  useEffect(() => {
    const fetchData = async () => {
      if (dataCollector && !hasLoadedQuestions) {
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

        const type: string = instance.getType() ?? ''

        const fetchedQuestions: Question[] = (
          type === 'form'
            ? await getQuestionsByForm(instance.getUuid() ?? '')
            : await getQuestionsBySurvey(instance.getUuid() ?? '')
        ).map(
          (question: {
            uuid: string
            text: string
            required: boolean
            order: number
            type: any
          }) => {
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
          },
        )

        const currentQuestions: Question[] = instance.getQuestions() ?? []

        const areDifferent: boolean =
          currentQuestions.length !== fetchedQuestions.length ||
          currentQuestions.some((question, index) => {
            const fetchedQuestion = fetchedQuestions[index]

            return (
              question.getUuid() !== fetchedQuestion.getUuid() ||
              question.getText() !== fetchedQuestion.getText() ||
              question.getRequired() !== fetchedQuestion.getRequired() ||
              question.getOrder() !== fetchedQuestion.getOrder()
            )
          })

        if (areDifferent) {
          const updatedDataCollector: DataCollector = new DataCollector({
            ...dataCollector?.['props'],
            questions: fetchedQuestions,
          })

          setDataCollector(updatedDataCollector)
        }

        setHasLoadedQuestions(true)
        setSelectedQuestionUuid('')
      }
    }

    fetchData()
  }, [
    dataCollector,
    setDataCollector,
    hasLoadedQuestions,
    setSelectedQuestionUuid,
  ])

  // auto select the first question
  useEffect(() => {
    console.log('hasLoadedQuestions: ' + hasLoadedQuestions)

    if (hasLoadedQuestions && dataCollector && !selectedQuestionUuid) {
      const dataCollectorAny: any = dataCollector

      const instance: DataCollector = new DataCollector({
        uuid: dataCollectorAny.uuid,
        title: dataCollectorAny.title,
        description: dataCollectorAny.description,
        type: dataCollectorAny.type,
        isPublished: dataCollectorAny.isPublished,
        questions: dataCollectorAny.questions,
        createdAt: dataCollectorAny.createdAt,
        updatedAt: dataCollectorAny.updatedAt,
      })

      const questions: Question[] = instance.getQuestions() ?? []

      if (questions.length > 0) {
        setSelectedQuestionUuid(questions[0].getUuid() ?? '')
      }
    }
  }, [
    hasLoadedQuestions,
    dataCollector,
    selectedQuestionUuid,
    setSelectedQuestionUuid,
  ])

  // question types state
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])

  // question types depending on dataCollector type
  const FORM_TYPES: string[] = [
    'Welcome',
    'Legal',
    'Date',
    'Dropdown',
    'Email',
    'File',
    'Phone',
    'Picture',
    'Short Text',
    'Long Text',
    'Statement',
    'Website',
    'Greetings',
  ]

  const SURVEY_TYPES = [
    'Welcome',
    'Multiple Choice',
    'Yes No',
    'Rating',
    'Scale',
    'Short Text',
    'DropDown',
    'Greetings',
  ]

  // load question types
  useEffect(() => {
    const PRIORITY_FIRST: string[] = ['Welcome', 'Legal']
    const PRIORITY_LAST: string[] = ['Greetings']

    const fetchData = async () => {
      const types: QuestionType[] = (await getAllQuestionTypes()).map(
        (questionType: { uuid: string; name: string; description: string }) => {
          return new QuestionType({
            uuid: questionType.uuid,
            name: splitCamelCaseAndCapitalize(questionType.name),
            description: questionType.description,
          })
        },
      )

      const sortedTypes: QuestionType[] = types
        .filter(
          (type) =>
            !PRIORITY_FIRST.includes(type.getName()) &&
            !PRIORITY_LAST.includes(type.getName()),
        )
        .sort((firstType, secondType) =>
          firstType.getName().localeCompare(secondType.getName()),
        )

      const orderedTypes: QuestionType[] = [
        ...PRIORITY_FIRST.map((typeName) =>
          types.find((type) => type.getName() === typeName),
        ).filter((type): type is QuestionType => type !== undefined),
        ...sortedTypes,
        ...PRIORITY_LAST.map((typeName) =>
          types.find((type) => type.getName() === typeName),
        ).filter((type): type is QuestionType => type !== undefined),
      ]

      setQuestionTypes(orderedTypes)
    }

    fetchData()
  }, [])

  // questions
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

      setQuestions(fetchedQuestions)
    }

    fetchQuestions()
  }, [dataCollector])

  // modals state
  const [showModal, setShowModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // handle modal visibility
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // handle share modal visibility
  const handleShareModalVisibility = () => {
    setShowShareModal(true)
  }

  // handle question creation
  const handleQuestionCreation = async (questionTypeName: string) => {
    if (dataCollector) {
      const nextOrder: number = (dataCollector.getQuestions()?.length ?? 0) + 1

      const res = await createQuestion(
        dataCollector.getUuid() ?? '',
        toCamelCase(questionTypeName),
        nextOrder,
      )

      const newQuestion: Question = new Question({
        uuid: res.uuid,
        text: res.text,
        required: res.required,
        order: res.order,
        type: new QuestionType({
          uuid: res.type.uuid,
          name: res.type.name,
          description: res.type.description,
        }),
      })

      const updatedQuestions = [
        ...(dataCollector.getQuestions() ?? []),
        newQuestion,
      ]

      const updatedDataCollector: DataCollector = new DataCollector({
        ...dataCollector['props'],
        questions: updatedQuestions,
      })

      setDataCollector(updatedDataCollector)
      setSelectedQuestionUuid(newQuestion.getUuid() ?? '')
      setShowModal(false)
    }
  }

  // handle question deletion
  const handleQuestionDeletion = async (questionUuid: string) => {
    if (dataCollector) {
      await deleteQuestion(questionUuid)

      const updatedQuestions = (dataCollector.getQuestions() ?? []).filter(
        (question) => question.getUuid() !== questionUuid,
      )

      const updatedDataCollector = new DataCollector({
        ...dataCollector['props'],
        questions: updatedQuestions,
      })

      setDataCollector(updatedDataCollector)
    }
  }

  // handle question click
  const handleQuestionClick = (questionUuid: string) => {
    setSelectedQuestionUuid(questionUuid)
  }

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const formPublished: string = 'Form published successfully!'
  const formPublicationFailed: string =
    'Failed to publish the form. Please try again later.'
  const surveyPublished: string = 'Survey published successfully!'
  const surveyPublicationFailed: string =
    'Failed to publish the survey. Please try again later.'
  const formAlreadyPublished: string = 'This form has already been published.'
  const surveyAlreadyPublished: string = 'This form has already been published.'
  const linkCopied: string = 'Link copied successfully!'
  const linkCopyFailed: string = 'Failed to copy.'

  // handle dataCollector publication
  const handleDataCollectorPublication = async (
    dataCollectorUuid: string,
    dataCollectorType: string,
    isPublished: boolean,
  ) => {
    if (dataCollectorType === 'form') {
      if (!isPublished) {
        try {
          const publishedForm: any = await publishForm(dataCollectorUuid)

          setDataCollector(
            new DataCollector({
              uuid: publishedForm.uuid,
              title: publishedForm.title,
              description: publishedForm.description,
              type: publishedForm.type,
              userUuid: publishedForm.userUuid,
              questions: publishedForm.questions.map(
                (question: {
                  uuid: string
                  text: string
                  required: boolean
                  order: number
                  type: {
                    uuid: string
                    name: string
                    description: string
                  }
                }) => {
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
                },
              ),
              isPublished: publishedForm.isPublished,
              updatedAt: publishedForm.updatedAt,
              createdAt: publishedForm.createdAt,
            }),
          )

          setInfoMessage(formPublished)
          setShowShareModal(false)
        } catch {
          setInfoMessage(formPublicationFailed)
          setShowShareModal(false)
        }
      } else {
        setInfoMessage(formAlreadyPublished)
        setShowShareModal(false)
      }
    } else if (dataCollectorType === 'survey') {
      if (!isPublished) {
        try {
          const publishedSurvey: any = await publishSurvey(dataCollectorUuid)

          setDataCollector(
            new DataCollector({
              uuid: publishedSurvey.uuid,
              title: publishedSurvey.title,
              description: publishedSurvey.description,
              type: publishedSurvey.type,
              userUuid: publishedSurvey.userUuid,
              questions: publishedSurvey.questions.map(
                (question: {
                  uuid: string
                  text: string
                  required: boolean
                  order: number
                  type: {
                    uuid: string
                    name: string
                    description: string
                  }
                }) => {
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
                },
              ),
              isPublished: publishedSurvey.isPublished,
              updatedAt: publishedSurvey.updatedAt,
              createdAt: publishedSurvey.createdAt,
            }),
          )

          setInfoMessage(surveyPublished)
          setShowShareModal(false)
        } catch {
          setInfoMessage(surveyPublicationFailed)
          setShowShareModal(false)
        }
      } else {
        setInfoMessage(surveyAlreadyPublished)
        setShowShareModal(false)
      }
    }
  }

  // handle copy link
  const handleCopyLink = async () => {
    const link = generatePublicLink()
    try {
      await navigator.clipboard.writeText(link)

      setInfoMessage(linkCopied)
      setShowShareModal(false)
    } catch {
      setInfoMessage(linkCopyFailed)
      setShowShareModal(false)
    }
  }

  // public link generation
  const generatePublicLink = () => {
    const uuid = dataCollector?.getUuid()
    const type = dataCollector?.getType()

    if (uuid) {
      return `${process.env.NEXT_PUBLIC_FRONTEND_URL}/public/${type}/${uuid}`
    }

    return ''
  }

  return (
    <>
      {showModal && (
        <Modal params={{ setShowModal }}>
          <ul>
            {questionTypes
              .filter((questionType) => {
                const formType: string =
                  dataCollector?.getType() ??
                  dataCollector?.['props'].type ??
                  ''

                if (formType === 'form') {
                  return FORM_TYPES.includes(questionType.getName())
                } else if (formType === 'survey') {
                  return SURVEY_TYPES.includes(questionType.getName())
                }

                return false
              })
              .map((questionType: QuestionType) => (
                <li key={questionType.getUuid()}>
                  <Article
                    params={{
                      onClick: () =>
                        handleQuestionCreation(questionType.getName()),
                    }}
                  >
                    <SmallTitle params={{ text: questionType.getName() }} />
                    <p>{questionType.getDescription()}</p>
                  </Article>
                </li>
              ))}
          </ul>
        </Modal>
      )}
      {showShareModal && (
        <Modal params={{ setShowModal: setShowShareModal }}>
          <Button
            params={{
              type: ButtonType.Button,
              text: 'Publish',
              onClick: () =>
                handleDataCollectorPublication(
                  dataCollector?.getUuid() ?? '',
                  dataCollector?.getType() ?? '',
                  dataCollector?.getIsPublished() ?? false,
                ),
              className: styles.publish_btn,
            }}
          />
          {dataCollector?.getIsPublished() && (
            <div className={styles.public_url_container}>
              <Input
                params={{
                  type: 'url',
                  id: 'public_link',
                  value: generatePublicLink(),
                  onChange: () => {},
                  placeholder: '',
                  required: false,
                  disabled: true,
                }}
              />
              <Button
                params={{
                  type: ButtonType.Button,
                  text: 'Copy',
                  onClick: handleCopyLink,
                }}
              />
            </div>
          )}
        </Modal>
      )}
      <div className={styles.share_container}>
        {infoMessage && <Message params={{ type: '', text: infoMessage }} />}
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Share',
            onClick: handleShareModalVisibility,
            className: styles.share_btn,
          }}
        />
      </div>
      <Footer params={{ className: styles.secondary_footer }}>
        <nav>
          <ul className={styles.questions_container}>
            {questions.map((question: any) => (
              <li key={question.uuid}>
                <Article
                  params={{
                    className: styles.question_card,
                  }}
                >
                  <div className={styles.card_inner}>
                    <Button
                      params={{
                        type: ButtonType.Button,
                        text: 'X',
                        onClick: () =>
                          handleQuestionDeletion(question.uuid ?? ''),
                        className: styles.delete_button,
                      }}
                    />
                  </div>
                  <button
                    className={styles.order_button}
                    onClick={() => handleQuestionClick(question.uuid ?? '')}
                  >
                    <SmallTitle params={{ text: String(question.order) }} />
                  </button>
                </Article>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          params={{
            type: ButtonType.Button,
            text: '+',
            onClick: handleModalVisibility,
          }}
        />
      </Footer>
    </>
  )
}
