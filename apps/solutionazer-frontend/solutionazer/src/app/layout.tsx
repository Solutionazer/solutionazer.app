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

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import Main from '../components/shared/containers/Main'
import Footer from '../components/shared/containers/Footer'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Solutionazer',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`container ${geistSans.variable} ${geistMono.variable}`}
        data-theme="light"
      >
        <Main params={{ className: 'main' }}>{children}</Main>
        <Footer params={{ className: 'footer' }}>
          <p>
            &copy; 2025 David Llamas Román. Licensed under the{' '}
            <a
              href="https://www.gnu.org/licenses/gpl-3.0.en.html"
              target="_blank"
            >
              GNU General Public License version 3 (GPL-3.0) only
            </a>
          </p>
        </Footer>
      </body>
    </html>
  )
}
