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
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import jsPDF from 'jspdf'
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
          //  const answersResponse = await getAnswers()

          setStats(statsResponse)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchData()
  }, [dataCollector])

  // format interval
  const formatInterval = (interval: any) => {
    if (typeof interval === 'string') return interval

    if (typeof interval === 'object' && interval !== null) {
      const pad = (n: number) => String(n).padStart(2, '0')

      const hours = pad(interval.hours || 0)
      const minutes = pad(interval.minutes || 0)
      const seconds = pad(interval.seconds || 0)

      return `${hours}:${minutes}:${seconds}`
    }

    return '00:00:00'
  }

  // 'onClick' | download button
  const handleDownloadPDF = () => {
    if (!stats) return

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const center = (
      text: string,
      y: number,
      fontSize = 16,
      weight: 'normal' | 'bold' = 'normal',
    ) => {
      doc.setFont('helvetica', weight)
      doc.setFontSize(fontSize)
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      doc.text(text, x, y)
    }

    doc.setTextColor(40, 40, 40)

    center(
      (dataCollector?.getType() ?? '') === 'form'
        ? 'Form Statistics Report'
        : 'Survey Statistics Report',
      88,
      26,
      'bold',
    )

    center('Metrics', 130, 14, 'bold')

    doc.setFontSize(18)

    const lines = [
      `Completed responses: ${stats.completedResponses}`,
      `Partial responses: ${stats.partialResponses}`,
      `Average time: ${formatInterval(stats.averageTime)}`,
      `Completion rate: ${stats.completionRate}%`,
    ]

    let y = 180
    for (const line of lines) {
      center(line, y, 16)
      y += 30
    }

    doc.setFontSize(10)
    center(
      `Generated on ${new Date().toLocaleDateString()} by solutionazer.app`,
      540,
      10,
    )

    doc.save('solutionazer-statistics.pdf')
  }

  return (
    <Article
      params={{
        className: styles.stats_container,
      }}
    >
      {stats ? (
        <Article>
          <div>
            <Button
              params={{
                type: ButtonType.Button,
                text: 'Download',
                onClick: handleDownloadPDF,
              }}
            />
          </div>
          <p>
            <span>Completed responses:</span>
            {stats.completedResponses}
          </p>
          <p>
            <span>Partial responses:</span>
            {stats.partialResponses}
          </p>
          <p>
            <span>Average time:</span> {formatInterval(stats.averageTime)}
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
