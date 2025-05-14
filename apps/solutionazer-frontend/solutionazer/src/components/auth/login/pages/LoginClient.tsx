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

import AuthForm from '@/components/shared/form/auth/AuthForm'
import Title from '@/components/shared/titles/Title'
import useAuthStore from '@/lib/auth/states/global/authStore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import Link from 'next/link'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginClient() {
  // query params
  const params = useSearchParams()

  // context
  const context = params.get('context') ?? 'login'

  // router
  const router: AppRouterInstance = useRouter()

  // auth global state
  const { user } = useAuthStore()

  // password empty state
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false)

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const passwordEmpty: string = `You must first 'Log In'`

  // 'onClick'
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (!user) {
      setIsPasswordEmpty(true)
      setInfoMessage(passwordEmpty)
    } else {
      setIsPasswordEmpty(false)
      setInfoMessage(null)

      const path: string = '/register?userType=enterprise'

      router.prefetch(path)
      router.push(path)
    }
  }

  return (
    <>
      <Title
        params={{
          text: context === 'login' ? 'Log In or Register' : 'Log In',
          classNames: ['title'],
        }}
      />
      <AuthForm
        params={{ context, isPasswordEmpty, setIsPasswordEmpty, infoMessage }}
      />
      {!context && (
        <p>
          {`Do you want to create an 'Enterprise' account?`}
          <Link href="/register?userType=enterprise" onClick={handleLinkClick}>
            Click here
          </Link>
        </p>
      )}
    </>
  )
}
