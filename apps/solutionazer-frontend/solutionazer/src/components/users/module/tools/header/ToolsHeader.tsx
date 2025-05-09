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

  // options
  const options: Option[] = [
    new Option(1, 'Editor'),
    new Option(2, '.'),
    new Option(3, '.'),
  ]

  // routes
  const routes: string[] = options.map((option) => {
    return `${module}/${option.getText().toLowerCase()}`
  })

  // title state
  const [title, setTitle] = useState('')

  // synchronize dataCollector title with local title
  useEffect(() => {
    if (dataCollector) {
      setTitle(dataCollector.getTitle() ?? '')
    }
  }, [dataCollector])

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setTitle(event.target.value)
  }

  const handleBlur = async () => {
    if (!dataCollector) return

    const newTitle: string = title.trim()

    if (newTitle !== dataCollector.getTitle()) {
      try {
        await updateFormTitle(dataCollector.getUuid() ?? '', newTitle)

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
