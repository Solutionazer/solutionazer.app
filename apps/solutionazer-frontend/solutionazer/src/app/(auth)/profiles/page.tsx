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

import Card from '@/components/profiles/Card'
import Article from '@/components/shared/containers/Article'
import Section from '@/components/shared/containers/Section'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Title from '@/components/shared/titles/Title'
import useAuthStore from '@/lib/auth/states/global/authStore'

export default function Profiles() {
  // auth global state
  const { user } = useAuthStore()

  return (
    <>
      <Title params={{ text: 'Profiles', classNames: ['title'] }} />
      <Section>
        <MediumTitle
          params={{ text: 'How do you want to log in?', classNames: [] }}
        />
        <Article params={{ className: '' }}>
          <SmallTitle params={{ text: 'User' }} />
          <Card params={{}} />
        </Article>
        <Article params={{ className: '' }}>
          <SmallTitle params={{ text: 'Companies' }} />
          <Card params={{}} />
        </Article>
      </Section>
    </>
  )
}
