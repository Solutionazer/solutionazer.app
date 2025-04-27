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

import ModuleNavbar from '../navigation/ModuleNavbar'
import Option from '../../../lib/options/option'
import Footer from '../../shared/containers/Footer'

import styles from './moduleFooter.module.css'

interface ModuleFooterProps {
  params: {
    module: string
  }
}

export default function ModuleFooter(props: Readonly<ModuleFooterProps>) {
  // props
  const { module } = props.params

  const options: Option[] = [
    new Option(1, 'home'),
    new Option(2, 'team'),
    new Option(3, 'account'),
  ]

  const routes: string[] = [
    `/${module}`,
    `/${module}/team`,
    `/${module}/account`,
  ]

  return (
    <Footer params={{ className: styles.secondary_footer }}>
      <ModuleNavbar params={{ options, routes }} />
    </Footer>
  )
}
