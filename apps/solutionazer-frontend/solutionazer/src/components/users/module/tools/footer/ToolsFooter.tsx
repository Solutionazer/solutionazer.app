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

import Footer from '@/components/shared/containers/Footer'

import styles from './toolsFooter.module.css'
import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { useEffect, useState } from 'react'
import Question from '@/lib/module/data-collectors/questions/question'
import {
  createQuestion,
  getAllQuestionTypes,
  getQuestionsByForm,
} from '@/lib/utils/data-collectors/questions/questionsHandler'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import Modal from '@/components/shared/containers/modal/Modal'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Article from '@/components/shared/containers/Article'
import QuestionType from '@/lib/module/data-collectors/questions/questionType'
import { splitCamelCaseAndCapitalize } from '@/lib/utils/textHandler'

export default function ToolsFooter() {
  // dataCollector global state
  const { dataCollector, setDataCollector, setSelectedQuestionUuid } =
    useDataCollector()

  //  has questions loading been done?
  const [hasLoadedQuestions, setHasLoadedQuestions] = useState(false)

  // fetch questions
  useEffect(() => {
    const fetchData = async () => {
      if (dataCollector && !hasLoadedQuestions) {
        const fetchedQuestions: Question[] = (
          await getQuestionsByForm(dataCollector?.getUuid() ?? '')
        ).map(
          (question: {
            uuid: string
            text: string
            required: boolean
            order: number
          }) => {
            return new Question({
              uuid: question.uuid,
              text: question.text,
              required: question.required,
              order: question.order,
            })
          },
        )

        const currentQuestions: Question[] = dataCollector.getQuestions() ?? []

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
      }
    }

    fetchData()
  }, [dataCollector, setDataCollector, hasLoadedQuestions])

  // question types state
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([])

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
  const questions: Question[] = dataCollector?.getQuestions() ?? []

  // modal state
  const [showModal, setShowModal] = useState(false)

  // handle question creation
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // handle question creation
  const handleQuestionCreation = async (questionTypeName: string) => {
    if (dataCollector) {
      const res = await createQuestion(
        dataCollector.getUuid() ?? '',
        questionTypeName,
      )

      const newQuestion: Question = new Question({
        uuid: res.uuid,
        text: res.text,
        required: res.required,
        order: res.order,
        type: res.type,
      })

      const updatedQuestions = [
        ...(dataCollector.getQuestions() ?? []),
        newQuestion,
      ]

      const updatedDataCollector = new DataCollector({
        ...dataCollector['props'],
        questions: updatedQuestions,
      })

      setDataCollector(updatedDataCollector)
      setSelectedQuestionUuid(newQuestion.getUuid() ?? '')
      setShowModal(false)
    }
  }

  // handle question click
  const handleQuestionClick = (questionUuid: string) => {
    setSelectedQuestionUuid(questionUuid)
  }

  return (
    <>
      {showModal && (
        <Modal params={{ setShowModal }}>
          <ul>
            {questionTypes.map((questionType: QuestionType) => (
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
      <Footer params={{ className: styles.secondary_footer }}>
        <nav>
          <ul>
            {questions.map((question) => (
              <li key={question.getUuid()}>
                <Article
                  params={{
                    onClick: () =>
                      handleQuestionClick(question.getUuid() ?? ''),
                  }}
                ></Article>
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
