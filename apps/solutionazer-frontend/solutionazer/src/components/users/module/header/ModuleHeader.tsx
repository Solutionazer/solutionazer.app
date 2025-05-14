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
import Input from '../../../shared/form/components/Input'
import { capitalize } from '@/lib/utils/textHandler'

import styles from './moduleHeader.module.css'
import Fieldset from '../../../shared/form/components/containers/fieldset/Fieldset'
import Label from '../../../shared/form/components/Label'
import ModuleOptions from '@/lib/module/record/moduleOptions'
import Navbar from '@/components/shared/navigation/Navbar'
import useSearch from '@/lib/module/states/global/searchStore'
import Header from '@/components/shared/containers/Header'

interface ModuleHeaderProps {
  params: {
    module: string
  }
}

export default function ModuleHeader(props: Readonly<ModuleHeaderProps>) {
  // props
  const { module } = props.params

  // options
  const options: Option[] = ModuleOptions[module].map(
    (name, index) => new Option(index + 1, name),
  )

  // routes
  const routes: string[] = ModuleOptions[module].map((name) =>
    name.toLowerCase().replace(/\s+/g, '-'),
  )

  // search input state
  const { searchInput, setSearchInput } = useSearch()

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setSearchInput(event.target.value)
  }

  // an input type
  const typeSearch: string = 'search'

  return (
    <Header params={{ className: styles.header }}>
      <Fieldset>
        <Input
          params={{
            type: typeSearch,
            id: typeSearch,
            value: searchInput,
            onChange: handleInputValuesChange,
            placeholder: ' ',
            required: false,
            disabled: false,
          }}
        />
        <Label params={{ htmlFor: typeSearch, text: capitalize(typeSearch) }} />
      </Fieldset>
      <Navbar params={{ options, routes }} />
    </Header>
  )
}
