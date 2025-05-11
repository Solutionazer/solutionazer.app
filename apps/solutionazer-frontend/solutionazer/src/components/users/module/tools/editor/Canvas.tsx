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
import Select from '@/components/shared/form/components/Select'

export default function Canvas() {
  // dataCollector global state
  const { dataCollector, selectedQuestionUuid } = useDataCollector()

  // questions
  const questions: Question[] = dataCollector?.getQuestions() ?? []

  // selected question
  const selectedQuestion: Question | undefined = questions.find(
    (question) => question.getUuid() === selectedQuestionUuid,
  )

  // render input
  const renderInput = () => {
    const type = selectedQuestion['props'].type

    switch (type) {
      case 'Welcome':
        return (
          <Input
            params={{
              type: 'text',
              id: 'welcome_description',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Legal':
        return (
          <Input
            params={{
              type: 'text',
              id: 'legal_text',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Date':
        return (
          <Input
            params={{
              type: 'date',
              id: 'date',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Dropdown':
        return (
          <Select
            params={{
              id: 'dropdown',
              options: [],
              value: '',
              onChange: () => {},
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Email':
        return (
          <Input
            params={{
              type: 'email',
              id: 'email',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'File':
        return (
          <Input
            params={{
              type: 'file',
              id: 'file',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Multiple Choice':
        return (
          <Input
            params={{
              type: 'checkbox',
              id: 'multiple_choice',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Phone':
        return (
          <Input
            params={{
              type: 'phone',
              id: 'phone',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Picture':
        return (
          <Input
            params={{
              type: 'image',
              id: 'picture',
              value: '',
              onChange: () => {},
              placeholder: ' ',
              required: false,
              disabled: false,
            }}
          />
        )
      case 'Rating':
        break
      case 'Scale':
        break
      case 'Short Text':
        break
      case 'Statement':
        break
      case 'Website':
        break
      case 'Yes No':
        break
      case 'Greetings':
        break
    }
  }

  return (
    <div className={styles.canvas}>
      <p>{selectedQuestion?.getText()}</p>
    </div>
  )
}
