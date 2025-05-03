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

import { usePathname } from 'next/navigation'
import styles from './layout.module.css'
import ModuleFooter from '@/components/module/footer/ModuleFooter'
import ToolsHeader from '@/components/module/tools/header/ToolsHeader'
import { useModuleStore } from '@/lib/module/states/global/moduleStore'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // module global state
  const { module } = useModuleStore()

  // path
  const path: string = usePathname()
  const isEditorPath: boolean = path.endsWith('/editor')

  return (
    <>
      {!isEditorPath ? (
        <div className={styles.module_layout}>
          {children}
          <ModuleFooter />
        </div>
      ) : (
        <div className={styles.users_layout}>
          <ToolsHeader params={{ module: module ?? '' }} />
          {children}
        </div>
      )}
    </>
  )
}
