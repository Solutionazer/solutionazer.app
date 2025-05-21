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

import Article from '@/components/shared/containers/Article'
import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import { getStats } from '@/lib/utils/data-collectors/stats/statsHandler'
import { useEffect, useState } from 'react'

import styles from './page.module.css'
//import { getAnswers } from '@/lib/utils/data-collectors/questions/questionsHandler'

export default function Stats() {
  // dataCollector global state
  const { dataCollector } = useDataCollector()

  // stats state
  const [stats, setStats] = useState<any>(null)

  // answers state
  // const [answers, setAnswers] = useState<any[]>([])

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (dataCollector) {
        const uuid: string = dataCollector.getUuid() ?? ''

        try {
          const statsResponse = await getStats(uuid)
          // const answersResponse = await getAnswers()

          setStats(statsResponse)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchData()
  }, [dataCollector])

  console.log(stats?.averageTime)

  return (
    <Article
      params={{
        className: styles.stats_container,
      }}
    >
      {stats ? (
        <Article>
          <p>
            <span>Completed responses:</span>
            {stats.completedResponses}
          </p>
          <p>
            <span>Partial responses:</span>
            {stats.partialResponses}
          </p>
          <p>
            <span>Average time:</span> {`${stats.averageTime}`}
          </p>
          <p>
            <span>Completion rate:</span>
            {stats.completionRate}
          </p>
        </Article>
      ) : (
        <p>{`No statistics available.`}</p>
      )}
    </Article>
  )
}
