'use client'

import Footer from '@/components/shared/containers/Footer'

import styles from './toolsFooter.module.css'
import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { useEffect, useState } from 'react'
import Question from '@/lib/module/data-collectors/questions/question'
import { getQuestionsByForm } from '@/lib/utils/data-collectors/questions/questionsHandler'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import Modal from '@/components/shared/containers/modal/Modal'

export default function ToolsFooter() {
  // dataCollector global state
  const { dataCollector, setDataCollector } = useDataCollector()

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

  // questions
  const questions: Question[] = dataCollector?.getQuestions() ?? []

  // modal state
  const [showModal, setShowModal] = useState(false)

  // handle question creation
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  return (
    <>
      {showModal && <Modal params={{ setShowModal }}>Modal</Modal>}
      <Footer params={{ className: styles.secondary_footer }}>
        <nav>
          <ul>
            {questions.map((question) => (
              <li key={question.getUuid()}></li>
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
