'use client'

import Footer from '@/components/shared/containers/Footer'

import styles from './toolsFooter.module.css'
import useDataCollector from '@/lib/data-collectors/states/global/dataCollectorStore'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/forms/enums/buttonType'
import { useEffect } from 'react'

export default function ToolsFooter() {
  // dataCollector global state
  const { dataCollector, setDataCollector } = useDataCollector()

  // form or survey?
  const isForm: boolean = dataCollector?.getType() === 'form'

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
      } catch {}
    }
  })

  return (
    <Footer params={{ className: styles.secondary_footer }}>
      <nav>
        <ul></ul>
      </nav>
      <Button params={{ type: ButtonType.Button, text: '+' }} />
    </Footer>
  )
}
