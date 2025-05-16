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

import Input from '@/components/shared/form/components/Input'
import Navbar from '@/components/shared/navigation/Navbar'
import Option from '@/lib/options/option'

import styles from './toolsHeader.module.css'
import Link from 'next/link'
import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'
import { useEffect, useState } from 'react'
import { updateFormTitle } from '@/lib/utils/data-collectors/formsHandler'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import Header from '@/components/shared/containers/Header'
import { updateSurveyTitle } from '@/lib/utils/data-collectors/surveysHandler'

interface ToolsHeaderProps {
  params: {
    module: string
  }
}

export default function ToolsHeader(props: Readonly<ToolsHeaderProps>) {
  // props
  const { module } = props.params

  // dataCollector global state
  const { dataCollector, setDataCollector } = useDataCollector()

  const dataCollectorAny: any = dataCollector

  // options
  const options: Option[] = [
    new Option(1, 'Editor'),
    new Option(2, 'Data'),
    new Option(3, 'Stats'),
  ]

  // routes
  const routes: string[] = options.map((option) => {
    const text: string = option.getText().toLowerCase()

    return `/${module}/${text}`
  })

  // title state
  const [title, setTitle] = useState('')

  // synchronize dataCollector title with local title
  useEffect(() => {
    if (dataCollector) {
      const instance: DataCollector = new DataCollector({
        uuid: dataCollectorAny.uuid,
        title: dataCollectorAny.title,
        description: dataCollectorAny.description,
        type: dataCollectorAny.type,
        isPublished: dataCollectorAny.isPublished,
        createdAt: dataCollectorAny.createdAt,
        updatedAt: dataCollectorAny.updatedAt,
      })
      setTitle(instance.getTitle() ?? '')
    }
  }, [dataCollector])

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setTitle(event.target.value)
  }

  // blur
  const handleBlur = async () => {
    if (!dataCollector) return

    const newTitle: string = title.trim()

    if (newTitle !== dataCollector.getTitle()) {
      try {
        if ((dataCollector.getType() ?? '') === 'form') {
          await updateFormTitle(dataCollector.getUuid() ?? '', newTitle)
        } else if ((dataCollector.getType() ?? '') === 'survey') {
          await updateSurveyTitle(dataCollector.getUuid() ?? '', newTitle)
        }

        const updatedDataCollector = new DataCollector({
          ...dataCollector,
          title: newTitle,
        })

        setDataCollector(updatedDataCollector)
      } catch {}
    }
  }

  return (
    <Header params={{ className: styles.header }}>
      <div>
        <Input
          params={{
            type: 'text',
            id: 'title',
            value: title,
            onChange: handleInputValuesChange,
            onBlur: () => {
              handleBlur().catch(() => {})
            },
            placeholder: ' ',
            required: false,
            disabled: false,
          }}
        />
        <Link href={`/${module}`}>←</Link>
      </div>
      <Navbar params={{ options, routes }} />
    </Header>
  )
}
