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

interface CardProps {
  params: {
    form?: object
    survey?: object
  }
}

export default function Card(props: Readonly<CardProps>) {
  const { form, survey } = props.params

  return (
    <Article params={{ className: styles.card_container }}>
      <div>
        <a href="#" className={styles.delete_btn}>
          X
        </a>
      </div>
      <Link href={''} className={styles.card}>
        <Article params={{ className: styles.info }}>
          <MediumTitle
            params={{ text: form?.title ?? survey?.title, classNames: [] }}
          />
          <p>{form?.description ?? survey?.description}</p>
        </Article>
      </Link>
    </Article>
  )
}
