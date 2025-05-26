/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const dynamic = 'force-dynamic'

import Card from '@/components/auth/profiles/Card'
import Article from '@/components/shared/containers/Article'
import Section from '@/components/shared/containers/Section'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Title from '@/components/shared/titles/Title'
import Admin from '@/lib/auth/companies/admins/admin'
import Company from '@/lib/auth/companies/company'
import Member from '@/lib/auth/companies/members/member'
import useAuthStore from '@/lib/auth/states/global/authStore'
import { getCompaniesByUser } from '@/lib/utils/users-management/companyHandler'
import { useEffect, useState } from 'react'

import styles from './page.module.css'

export default function Profiles() {
  // auth global state
  const { user } = useAuthStore()

  // companies
  const [companies, setCompanies] = useState<Company[]>([])

  // load companies
  useEffect(() => {
    const fetchData = async () => {
      if (user?.getUuid()) {
        const data = (await getCompaniesByUser(user.getUuid())).map(
          (company: {
            uuid: string
            name: string
            admins: Admin[]
            members: Member[]
          }) => {
            return new Company({
              uuid: company.uuid,
              name: company.name,
              admins: company.admins.map((admin: any) => {
                return new Admin({
                  uuid: admin.uuid,
                  fullName: admin.fullName,
                  email: admin.email,
                })
              }),
              members: company.members.map((member: any) => {
                return new Member({
                  uuid: member.uuid,
                  fullName: member.fullName,
                  email: member.email,
                })
              }),
            })
          },
        )

        console.log(data)

        setCompanies(data)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className={styles.profiles_content}>
      <Title params={{ text: 'Profiles', classNames: ['title'] }} />
      <Section>
        <MediumTitle
          params={{ text: 'How do you want to log in?', classNames: [] }}
        />
        <Article params={{ className: styles.card_container }}>
          <SmallTitle params={{ text: 'User' }} />
          <div>
            <Card params={{ userFullName: user?.getFullName() }} />
          </div>
        </Article>
        <Article params={{ className: styles.card_container }}>
          <SmallTitle params={{ text: 'Companies' }} />
          <div>
            {companies.map((company) => (
              <Card key={company.getUuid()} params={{ company }} />
            ))}
          </div>
        </Article>
      </Section>
    </div>
  )
}
