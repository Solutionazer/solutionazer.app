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
import { getAnswers } from '@/lib/utils/data-collectors/questions/questionsHandler'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import DataCollector from '@/lib/module/data-collectors/dataCollector'

export default function Stats() {
  const { dataCollector } = useDataCollector()

  const dataCollectorAny: any = dataCollector

  const [stats, setStats] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, any[]>>({})
  const [expandedAnswers, setExpandedAnswers] = useState<
    Record<string, boolean>
  >({})
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({})

  const toggleExpanded = (key: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const ExpandableText = ({
    text,
    id,
    maxLength = 50,
  }: {
    text: string
    id: string
    maxLength?: number
  }) => {
    const isLong = text.length > maxLength
    const expanded = expandedAnswers[id]
    const displayText =
      expanded || !isLong ? text : text.slice(0, maxLength) + '...'

    return (
      <span
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
          padding: 0,
        }}
      >
        {displayText}{' '}
        {isLong && (
          <button
            onClick={() => toggleExpanded(id)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginLeft: '0.25rem',
              color: 'var(--title-color)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {expanded ? 'ver menos' : 'ver más'}
          </button>
        )}
      </span>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      if (dataCollector) {
        setStats(null)
        setAnswers({})
        setExpandedAnswers({})
        setExpandedQuestions({})

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
        try {
          const statsResponse = await getStats(uuid)
          const answersResponse = await getAnswers(uuid)

          setStats(statsResponse)

          if (Array.isArray(answersResponse)) {
            const transformed = {
              ['default']: answersResponse,
            }
            setAnswers(transformed)
          } else {
            setAnswers(answersResponse)
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        setStats(null)
        setAnswers({})
        setExpandedAnswers({})
        setExpandedQuestions({})
      }
    }

    fetchData()
  }, [dataCollector])

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

  const hasResponses = Object.values(answers).some(
    (resps) => Array.isArray(resps) && resps.length > 0,
  )

  return (
    <Article params={{ className: styles.stats_container }}>
      {stats ? (
        <>
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
          <Article params={{ className: styles.responses }}>
            <MediumTitle params={{ text: 'Responses', classNames: [] }} />
            <ul className={styles.responses_list}>
              {hasResponses ? (
                Object.entries(answers).map(
                  ([uuid, responses]: [string, any[]], index: number) => (
                    <div key={uuid}>
                      <SmallTitle params={{ text: `Response ${index + 1}` }} />
                      <ul>
                        {Array.isArray(responses) &&
                          responses.map((resp, i) => {
                            const questionId = `${uuid}-${i}`
                            const isExpanded = expandedQuestions[questionId]
                            return (
                              <li
                                key={questionId}
                                style={{ marginBottom: '1rem' }}
                              >
                                <button
                                  onClick={() => toggleQuestion(questionId)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: 'var(--title-color)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {`Question ${i + 1} ${isExpanded ? '▲' : '▼'}`}
                                </button>
                                {isExpanded && (
                                  <>
                                    <p>
                                      <strong>Question:</strong>{' '}
                                      {resp.questionText}
                                    </p>
                                    <p>
                                      <strong>Answer:</strong>{' '}
                                      {typeof resp.answer === 'boolean' ? (
                                        resp.answer ? (
                                          'Accepted'
                                        ) : (
                                          'Declined'
                                        )
                                      ) : Array.isArray(resp.answer) ? (
                                        resp.answer.join(', ')
                                      ) : (
                                        <ExpandableText
                                          text={resp.answer}
                                          id={questionId}
                                        />
                                      )}
                                    </p>
                                  </>
                                )}
                              </li>
                            )
                          })}
                      </ul>
                    </div>
                  ),
                )
              ) : (
                <p
                  style={{
                    color: 'var(--foreground-color)',
                    textAlign: 'center',
                  }}
                >
                  No one has responded yet.
                </p>
              )}
            </ul>
          </Article>
        </>
      ) : (
        <p>No statistics available.</p>
      )}
    </Article>
  )
}
