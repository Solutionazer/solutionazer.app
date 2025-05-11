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

import Article from '@/components/shared/containers/Article'
import Button from '@/components/shared/form/components/Button'
import Admin from '@/lib/auth/companies/admins/admin'
import ButtonType from '@/lib/auth/forms/enums/buttonType'

import styles from './card.module.css'
import SmallTitle from '@/components/shared/titles/SmallTitle'

interface CardProps {
  params: {
    admin: Admin
    onDelete: () => void
  }
}

export default function Card(props: Readonly<CardProps>) {
  // props
  const { admin, onDelete } = props.params

  return (
    <Article params={{ className: styles.card_container }}>
      <div>
        <Button
          params={{
            type: ButtonType.Button,
            text: 'X',
            onClick: onDelete,
            className: styles.delete_btn,
          }}
        />
      </div>
      <Article params={{ className: styles.card }}>
        <SmallTitle
          params={{
            text: admin.getFullName(),
          }}
        />
        <p>{admin.getEmail()}</p>
      </Article>
    </Article>
  )
}
