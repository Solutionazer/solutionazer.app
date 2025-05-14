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

import React, { Dispatch, SetStateAction } from 'react'
import styles from './modal.module.css'

interface ModalProps {
  params?: {
    setShowModal: Dispatch<SetStateAction<boolean>>
  }
  children: React.ReactNode
}

export default function Modal({ children, params }: Readonly<ModalProps>) {
  // params
  const setShowModal = params?.setShowModal

  // handle click in the modal's background
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && typeof setShowModal === 'function') {
      setShowModal(false)
    }
  }

  return (
    <div className={styles.modal_container} onClick={handleClickOutside}>
      <dialog className={styles.modal} open>
        {children}
      </dialog>
    </div>
  )
}
