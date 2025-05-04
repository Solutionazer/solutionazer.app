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

import Article from '@/components/shared/containers/Article'
import Button from '@/components/shared/form/components/Button'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Label from '@/components/shared/form/components/Label'
import Form from '@/components/shared/form/Form'
import ButtonType from '@/lib/forms/enums/buttonType'
import FormData from '@/lib/forms/formData'
import useFormStore from '@/lib/forms/states/global/formStore'

import styles from './page.module.css'
import Select from '@/components/shared/form/components/Select'
import UserType from '@/lib/forms/enums/userType'
import Option from '@/lib/options/option'
import useAuthStore from '@/lib/auth/states/global/authStore'
import React, { useEffect, useState } from 'react'
import { updateUser } from '@/lib/utils/users-management/usersHandler'
import Message from '@/components/shared/messages/Message'
import { logout } from '@/lib/utils/auth/authHandler'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'

export default function Account() {
  // auth global state
  const { user } = useAuthStore()

  // formData global state
  const { formData, setFormData, resetFormData } = useFormStore()

  // configure router
  const router: AppRouterInstance = useRouter()

  // set initial formData
  useEffect(() => {
    if (user) {
      const initialFormData = new FormData({
        email: user.getEmail() ?? '',
        userType: UserType.Individual,
        fullName: user.getFullName(),
      })

      setFormData(initialFormData)
    }
  }, [user, setFormData])

  // 'onSubmit'
  const handleAccountEdition: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    if (user) {
      try {
        await updateUser(
          user.getUuid(),
          formData.getFullName() ?? '',
          formData.getEmail() ?? '',
        )

        setInfoMessage(accountUpdated)
      } catch {
        setInfoMessage(accountUpdateFailed)
      }
    }
  }

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const { name, value } = event.target

    setFormData(createUpdatedFormData(name, value))
  }

  // create FormData (object) function to use into handleInputValuesChange
  const createUpdatedFormData = (name: string, value: string): FormData => {
    return new FormData({
      email: name === 'email' ? value : formData.getEmail(),
      userType: name === 'user_type' ? value : formData.getUserType(),
      fullName: name === 'full_name' ? value : formData.getFullName(),
    })
  }

  // 'onReset'
  const handleFormReset: React.FormEventHandler<HTMLFormElement> = () => {
    const initialFormData = new FormData({
      email: user?.getEmail() ?? '',
      userType: UserType.Individual,
      fullName: user?.getFullName() ?? '',
    })

    setFormData(initialFormData)
  }

  // logout
  const handleLogOut = async () => {
    try {
      await logout()
      resetFormData()

      const path: string = '/login'

      router.prefetch(path)
      router.push(path)
    } catch {}
  }

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const accountUpdated: string = `Account updated successfully!`
  const accountUpdateFailed: string = `Failed to update account.`

  return (
    <Article params={{ className: styles.article }}>
      <div className={styles.logout_btn_container}>
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Log Out',
            className: styles.logout_btn,
            onClick: handleLogOut,
          }}
        />
      </div>
      <Form
        params={{
          onSubmit: handleAccountEdition,
          onReset: handleFormReset,
          method: 'post',
        }}
      >
        <Fieldset>
          {infoMessage && <Message params={{ type: '', text: infoMessage }} />}
          <Fieldset>
            <Input
              params={{
                type: 'text',
                id: 'full_name',
                value: formData.getFullName() ?? '',
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: false,
              }}
            />
            <Label
              params={{
                htmlFor: 'full_name',
                text: 'Full Name',
              }}
            />
          </Fieldset>
          <Fieldset>
            <Input
              params={{
                type: 'email',
                id: 'email',
                value: formData.getEmail() ?? '',
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: false,
              }}
            />
            <Label params={{ htmlFor: 'email', text: 'Email' }} />
          </Fieldset>
          <Fieldset>
            <Select
              params={{
                id: 'user_type',
                options: [new Option(1, UserType.Individual)],
                value: formData.getUserType() ?? '',
                onChange: handleInputValuesChange,
                required: true,
                disabled: true,
              }}
            />
          </Fieldset>
        </Fieldset>
        <Fieldset params={{ className: styles.buttons_container }}>
          <Button
            params={{
              type: ButtonType.Reset,
              text: 'Reset',
            }}
          />
          <Button
            params={{
              type: ButtonType.Submit,
              text: 'Save',
            }}
          />
        </Fieldset>
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Change Password',
          }}
        />
      </Form>
    </Article>
  )
}
