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

import { notFound, useParams, usePathname } from 'next/navigation'
import { allowedModules } from '../../../lib/module/moduleData'

import styles from './layout.module.css'

import { useModuleStore } from '@/lib/module/states/global/moduleStore'
import { useEffect } from 'react'
import ModuleHeader from '@/components/users/module/header/ModuleHeader'

export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // props
  const { module } = useParams()

  if (typeof module !== 'string') {
    notFound()
  }

  // check if the route is allowed
  const isValidModule: boolean = allowedModules.includes(module)

  if (!isValidModule) {
    notFound()
  }

  // module global state
  const { setModule } = useModuleStore()

  useEffect(() => {
    setModule(module)
  }, [module, setModule])

  // path
  const path: string = usePathname()
  const isEditorPath: boolean = path.endsWith('/editor')
  const isDataPath: boolean = path.endsWith('/data')
  const isStatsPath: boolean = path.endsWith('/stats')

  return (
    <>
      {!isEditorPath && !isDataPath && !isStatsPath ? (
        <div className={styles.module_layout}>
          <ModuleHeader params={{ module }} />
          {children}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  )
}
