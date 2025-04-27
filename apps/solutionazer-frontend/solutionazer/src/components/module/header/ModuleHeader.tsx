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

'use client'

import Option from '@/lib/options/option'
import Input from '../../shared/form/components/Input'
import ModuleNavbar from '../navigation/ModuleNavbar'
import { capitalize } from '@/lib/utils/textHandler'

import styles from './moduleHeader.module.css'
import Fieldset from '../../shared/form/components/containers/fieldset/Fieldset'
import Label from '../../shared/form/components/Label'
import ModuleOptions from '@/lib/module/record/moduleOptions'

interface ModuleHeaderProps {
  params: {
    module: string
  }
}

export default function ModuleHeader(props: Readonly<ModuleHeaderProps>) {
  // props
  const { module } = props.params

  const options: Option[] = ModuleOptions[module].map(
    (name, index) => new Option(index + 1, name),
  )

  const routes: string[] = ModuleOptions[module].map((name) =>
    name.toLowerCase().replace(/\s+/g, '-'),
  )

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    event.preventDefault()
  }

  // an input type
  const typeSearch: string = 'search'

  return (
    <header className={styles.header}>
      <Fieldset>
        <Input
          params={{
            type: typeSearch,
            id: typeSearch,
            value: '',
            onChange: handleInputValuesChange,
            placeholder: ' ',
            required: false,
            disabled: false,
          }}
        />
        <Label params={{ htmlFor: typeSearch, text: capitalize(typeSearch) }} />
      </Fieldset>
      <ModuleNavbar params={{ options, routes }} />
    </header>
  )
}
