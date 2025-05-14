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

import Footer from '@/components/shared/containers/Footer'
import Navbar from '@/components/shared/navigation/Navbar'
import Option from '@/lib/options/option'

import styles from './companiesFooter.module.css'

export default function CompaniesFooter() {
  // options
  const options: Option[] = [
    new Option(1, 'users'),
    new Option(2, 'teams'),
    new Option(3, 'company'),
  ]

  // routes
  const routes: string[] = options.map((option) => {
    return `/${option.getText().toLowerCase() !== 'company' ? `company/${option.getText().toLowerCase()}` : option.getText().toLowerCase()}`
  })

  return (
    <Footer params={{ className: styles.secondary_footer }}>
      <Navbar params={{ options, routes }} />
    </Footer>
  )
}
