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
            }}
          />
        )
      case 'Legal':
        break
      case 'Date':
        break
      case 'Dropdown':
        break
      case 'Email':
        break
      case 'File':
        break
      case 'Multiple Choice':
        break
      case 'Phone':
        break
      case 'Picture':
        break
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
