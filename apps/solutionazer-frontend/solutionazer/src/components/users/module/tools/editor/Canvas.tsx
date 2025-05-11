/* eslint-disable @typescript-eslint/no-explicit-any */
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

import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import styles from './canvas.module.css'
import Question from '@/lib/module/data-collectors/questions/question'
import Input from '@/components/shared/form/components/Input'
import Article from '@/components/shared/containers/Article'
import { useEffect, useState } from 'react'
import { getConfig } from '@/lib/utils/data-collectors/questions/questionsHandler'

export default function Canvas() {
  // dataCollector global state
  const { dataCollector, selectedQuestionUuid } = useDataCollector()

  // questions
  const questions: Question[] = dataCollector?.getQuestions() ?? []

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

  // render input
  const renderInput = () => {
    if (selectedQuestion) {
      const type = selectedQuestion.getType()?.getName()

      console.log(type)
      console.log(questionConfig)

      switch (type) {
        case 'welcome':
          return (
            <Input
              params={{
                type: 'text',
                id: 'welcome_description',
                value: questionConfig?.description ?? '',
                onChange: () => {},
                placeholder: '',
                required: false,
                disabled: false,
              }}
            />
          )
        case 'legal':
          return (
            <div>
              <Input
                params={{
                  type: 'text',
                  id: 'legal_text',
                  value: questionConfig?.legalText ?? '',
                  onChange: () => {},
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
        case 'date':
          break
        case 'dropdown':
          break
        case 'email':
          break
        case 'file':
          break
        case 'multipleChoice':
          break
        case 'phone':
          break
        case 'picture':
          break
        case 'rating':
          break
        case 'scale':
          break
        case 'shortText':
          break
        case 'statement':
          break
        case 'website':
          break
        case 'yesNo':
          break
        case 'greetings':
          break
      }
    }
  }

  return (
    <div className={styles.canvas}>
      <Article>
        <Input
          params={{
            type: 'text',
            id: 'question_text',
            value:
              selectedQuestion?.getType()?.getName() === 'welcome'
                ? (questionConfig?.headline ?? '')
                : (selectedQuestion?.getText() ?? ''),
            onChange: () => {},
            placeholder: '',
            required: false,
            disabled: false,
          }}
        />
      </Article>
      <Article>{selectedQuestion && renderInput()}</Article>
    </div>
  )
}
