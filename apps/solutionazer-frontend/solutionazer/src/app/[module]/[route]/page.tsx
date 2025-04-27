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

import styles from './page.module.css'

export default function Route() {
  const individuals: any[] = [
    {
      uuid: 'a',
      fullName: 'Nombre 1',
    },
    {
      uuid: 'b',
      fullName: 'Nombre 2',
    },
    {
      uuid: 'c',
      fullName: 'Nombre 3',
    },
  ]

  return (
    <div className={styles.content}>
      <aside className={styles.aside}>
        <nav>
          <ul>
            {individuals.map((individual) => (
              <li key={individual.uuid}>
                <a href="#">{individual.fullName}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}
