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
// import Header from '@/components/shared/containers/Header'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import styles from './layout.module.css'

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

  return (
    <>
      {/*<Header>logo</Header>*/}
      {children}
      {!hideFooter && (
        <Footer params={{ className: styles.footer }}>
          <Button
            params={{
              type: ButtonType.Button,
              text: 'home',
              onClick: () => {
                const path: string = '/login'

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
