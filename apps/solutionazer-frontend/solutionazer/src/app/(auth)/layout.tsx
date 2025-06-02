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

import Footer from '@/components/shared/containers/Footer'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import styles from './layout.module.css'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // path
  const path: string = usePathname()

  // context
  const context = useSearchParams().get('context')

  // router
  const router = useRouter()

  // hide footer condition
  const hideFooter =
    path.endsWith('/profiles') || (path.endsWith('/login') && context !== null)

  // is...?
  const isProfiles: boolean = path.endsWith('/profiles')

  return (
    <>
      {!isProfiles && (
        <header
          style={{ display: 'grid', placeItems: 'center', paddingTop: '1rem' }}
        >
          <Image
            src="solutionazer-logo.svg"
            alt="solutionazer logo"
            width={136.6}
            height={53.3}
          />
        </header>
      )}
      {children}
      {!hideFooter && (
        <Footer params={{ className: styles.footer }}>
          <Button
            params={{
              type: ButtonType.Button,
              text: 'home',
              onClick: () => {
                const path: string = '/'

                router.prefetch(path)
                router.push(path)
              },
            }}
          />
        </Footer>
      )}
    </>
  )
}
