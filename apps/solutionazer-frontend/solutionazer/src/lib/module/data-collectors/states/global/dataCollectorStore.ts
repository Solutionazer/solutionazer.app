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

import { create, StoreApi, UseBoundStore } from 'zustand'
import DataCollector from '../../dataCollector'
import { persist } from 'zustand/middleware'
import Question from '../../questions/question'
import QuestionType from '../../questions/questionType'

interface DataCollectorState {
  dataCollector: DataCollector | null
  setDataCollector: (dataCollector: DataCollector) => void
  selectedQuestionUuid: string | null
  setSelectedQuestionUuid: (selectedQuestionUuid: string) => void
}

const useDataCollector: UseBoundStore<StoreApi<DataCollectorState>> = create<
  DataCollectorState,
  [['zustand/persist', DataCollectorState]]
>(
  persist(
    (set) => ({
      dataCollector: null,
      setDataCollector: (dataCollector) => set({ dataCollector }),
      selectedQuestionUuid: null,
      setSelectedQuestionUuid: (selectedQuestionUuid: string) =>
        set({ selectedQuestionUuid }),
    }),
    {
      name: 'dataCollector',
      onRehydrateStorage: () => (state) => {
        if (state?.dataCollector) {
          const plainDataCollector = state.dataCollector as any
          state.dataCollector = new DataCollector({
            uuid: plainDataCollector.uuid,
            title: plainDataCollector.title,
            description: plainDataCollector.description,
            type: plainDataCollector.type,
            userUuid: plainDataCollector.userUuid,
            questions: plainDataCollector.questions.map((question: any) => {
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
            isPublished: plainDataCollector.isPublished,
            updatedAt: plainDataCollector.updatedAt,
            createdAt: plainDataCollector.createdAt,
          })
        }
      },
    },
  ),
)

export default useDataCollector
