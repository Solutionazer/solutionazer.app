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

import { notFound } from 'next/navigation'
import ModuleFooter from '../../components/module/footer/ModuleFooter'
import { allowedModules } from '../../lib/module/moduleData'

import styles from './layout.module.css'
import ModuleHeader from '../../components/module/header/ModuleHeader'

interface ModuleLayoutProps {
  params: {
    module: string
  }
  children: React.ReactNode
}

export default function ModuleLayout({
  children,
  params,
}: Readonly<ModuleLayoutProps>) {
  // props
  const { module } = params
  // check if the route is allowed
  const isValidModule: boolean = allowedModules.includes(module)

  if (!isValidModule) {
    notFound()
  }

  return (
    <div className={styles.module_layout}>
      <ModuleHeader params={{ module }} />
      {children}
      <ModuleFooter params={{ module }} />
    </div>
  )
}
