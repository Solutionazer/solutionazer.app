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

import { create, StoreApi, UseBoundStore } from 'zustand'
import DataCollector from '../../dataCollector'
import { persist } from 'zustand/middleware'

interface DataCollectorState {
  dataCollector: DataCollector | null
  setDataCollector: (dataCollector: DataCollector) => void
}

const useDataCollector: UseBoundStore<StoreApi<DataCollectorState>> = create<
  DataCollectorState,
  [['zustand/persist', DataCollectorState]]
>(
  persist(
    (set) => ({
      dataCollector: null,
      setDataCollector: (dataCollector) => set({ dataCollector }),
    }),
    {
      name: 'dataCollector',
      onRehydrateStorage: () => (state) => {
        if (state?.dataCollector) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const plainDataCollector = state.dataCollector as any
          state.dataCollector = new DataCollector({
            uuid: plainDataCollector.uuid,
            title: plainDataCollector.title,
            description: plainDataCollector.description,
            type: plainDataCollector.type,
            userUuid: plainDataCollector.userUuid,
            questions: plainDataCollector.questions,
          })
        }
      },
    },
  ),
)

export default useDataCollector
