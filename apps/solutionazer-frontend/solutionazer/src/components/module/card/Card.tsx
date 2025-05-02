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

import Link from 'next/link'
import Article from '../../shared/containers/Article'
import MediumTitle from '../../shared/titles/MediumTitle'

import styles from './card.module.css'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/forms/enums/buttonType'
import useDataCollector from '@/lib/data-collectors/states/global/dataCollectorStore'
import DataCollector from '@/lib/data-collectors/dataCollector'

interface CardProps {
  params: {
    form?: DataCollector
    survey?: DataCollector
    onDelete: () => void
  }
}

export default function Card(props: Readonly<CardProps>) {
  // props
  const { form, survey, onDelete } = props.params

  // form or survey?
  const isForm: boolean = !!form

  // dataCollector global style
  const { setDataCollector } = useDataCollector()

  // 'onClick'
  const handleClick = () => {
    if (form) {
      setDataCollector(form)
    } else if (survey) {
      setDataCollector(survey)
    }
  }

  return (
    <Article params={{ className: styles.card_container }}>
      <div>
        <Button
          params={{
            type: ButtonType.Button,
            text: 'X',
            onClick: onDelete,
            className: styles.delete_btn,
          }}
        />
      </div>
      <Link
        href={`${isForm ? 'forms' : 'surveys'}/editor`}
        className={styles.card}
        onClick={handleClick}
      >
        <Article params={{ className: styles.info }}>
          <MediumTitle
            params={{
              text: form?.getTitle() ?? survey?.getTitle() ?? '',
              classNames: [],
            }}
          />
          <p>{form?.getDescription() ?? survey?.getDescription()}</p>
        </Article>
      </Link>
    </Article>
  )
}
