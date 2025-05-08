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

import Link from 'next/link'
import Article from '../shared/containers/Article'

import styles from './card.module.css'
import useAuthStore from '@/lib/auth/states/global/authStore'
import Company from '@/lib/auth/companies/company'

interface CardProps {
  params: {
    userFullName?: string
    company?: Company
  }
}

export default function Card(props: Readonly<CardProps>) {
  // props
  const { userFullName, company } = props.params

  // auth global state
  const { setCompany } = useAuthStore()

  // 'onClick'
  const handleLinkClick = () => {
    if (company) {
      setCompany(company)
    }
  }

  return (
    <Link
      href={userFullName ? '/forms' : '/dashboard'}
      className={styles.card}
      onClick={handleLinkClick}
    >
      <Article>
        <p>{userFullName ?? company?.getName()}</p>
      </Article>
    </Link>
  )
}
