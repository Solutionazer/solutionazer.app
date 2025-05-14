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

import { FormEventHandler } from 'react'
import styles from './form.module.css'

interface FormProps {
  params: {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    onReset?: FormEventHandler<HTMLFormElement>
    method: string
  }
  children: React.ReactNode
}

export default function Form({ children, params }: Readonly<FormProps>) {
  // props
  const { onSubmit, onReset, method } = params

  return (
    <form
      onSubmit={onSubmit}
      onReset={onReset}
      method={method}
      className={styles.form}
    >
      {children}
    </form>
  )
}
