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
import Image from 'next/image'

interface NavbarProps {
  params: {
    options: Array<Option>
    routes: Array<string>
  }
}

export default function Navbar(props: Readonly<NavbarProps>) {
  const { options, routes } = props.params

  const renderIcon = (text: string) => {
    switch (text) {
      case 'account':
        return (
          <Image
            src="/icons/black_account.svg"
            alt="account button"
            width={26}
            height={26}
          />
        )
      case 'teams':
        return (
          <Image
            src="/icons/black_teams.svg"
            alt="teams button"
            width={26}
            height={26}
          />
        )
      case 'home':
        return (
          <Image
            src="/icons/black_home.svg"
            alt="home button"
            width={26}
            height={26}
          />
        )
      case 'users':
        return (
          <Image
            src="/icons/black_users.svg"
            alt="users button"
            width={26}
            height={26}
          />
        )
      case 'company':
        return (
          <Image
            src="/icons/black_company.svg"
            alt="company button"
            width={26}
            height={26}
          />
        )
    }
  }

  return (
    <nav>
      <ul>
        {options.map((option) => {
          const text: string = option.getText()

          const isAccount: boolean = text === 'account'
          const isTeams: boolean = text === 'teams'
          const isHome: boolean = text === 'home'
          const isUsers: boolean = text === 'users'
          const isCompany: boolean = text === 'company'

          return (
            <li key={option.getId()}>
              <Link href={routes[option.getId() - 1]}>
                {!isAccount && !isTeams && !isHome && !isUsers && !isCompany
                  ? text
                  : renderIcon(text)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
