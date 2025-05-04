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

import Article from '../containers/Article'

import styles from './messages.module.css'

interface MessageProps {
  params: {
    type: string
    text: string
  }
}

export default function Message(props: Readonly<MessageProps>) {
  const { /*type,*/ text } = props.params

  return (
    <Article params={{ className: styles.error_message }}>
      <p>{text}</p>
    </Article>
  )
}
