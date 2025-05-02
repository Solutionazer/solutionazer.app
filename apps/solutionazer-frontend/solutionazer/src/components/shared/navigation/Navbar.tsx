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

import Option from '@/lib/options/option'

interface NavbarProps {
  params: {
    options: Array<Option>
    routes: Array<string>
  }
}

export default function Navbar(props: Readonly<NavbarProps>) {
  const { options, routes } = props.params

  return (
    <nav>
      <ul>
        {options.map((option) => (
          <li key={option.getId()}>
            <Link href={routes[option.getId() - 1]}>{option.getText()}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
