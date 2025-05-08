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

import ButtonType from '@/lib/auth/forms/enums/buttonType'
import Button from '../../shared/form/components/Button'
import Input from '../../shared/form/components/Input'
import Form from '../../shared/form/Form'
import Fieldset from '../../shared/form/components/containers/fieldset/Fieldset'
import Label from '../../shared/form/components/Label'
import { capitalize } from '@/lib/utils/textHandler'
import FormData from '@/lib/auth/forms/formData'
import useFormStore from '@/lib/auth/forms/states/global/formStore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/utils/auth/authHandler'
import useAuthStore from '@/lib/auth/states/global/authStore'
import { companyExists } from '@/lib/utils/users-management/companyHandler'
import AuthUser from '@/lib/auth/authUser'
import { Dispatch, SetStateAction, useState } from 'react'
import Message from '@/components/shared/messages/Message'

interface LoginFormProps {
  params?: {
    isPasswordEmpty?: boolean
    setIsPasswordEmpty?: Dispatch<SetStateAction<boolean>>
    infoMessage?: string | null
  }
}

export default function LoginForm(props: Readonly<LoginFormProps>) {
  // props
  const isPasswordEmpty = props.params?.isPasswordEmpty
  const setIsPasswordEmpty = props.params?.setIsPasswordEmpty
  const infoMessageFromLoginClient = props.params?.infoMessage

  // auth global state
  const { user, setUser } = useAuthStore()

  // formData global state
  const { formData, setFormData, resetFormData } = useFormStore()

  // configure router
  const router: AppRouterInstance = useRouter()

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const passwordError: string = 'Incorrect password.'
  const loggedInClickHere: string = `You are now logged in. You can now click 'Click here' to create an 'Enterprise' account.`

  // 'onSubmit'
  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    const password: string = formData.getPassword() ?? ''

    if (password.trim() === '') {
      setIsPasswordEmpty?.(true)
      return
    }

    try {
      const res = await login(formData.getEmail(), password)

      setUser(
        new AuthUser({
          uuid: res.user.uuid,
          fullName: res.user.fullName,
          email: res.user.email,
        }),
      )

      try {
        await companyExists(res.user.uuid)

        if (!infoMessageFromLoginClient) {
          resetFormData()

          const path: string = '/profiles'

          router.prefetch(path)
          router.push(path)
        } else {
          setInfoMessage(loggedInClickHere)
        }
      } catch {
        if (!infoMessageFromLoginClient) {
          resetFormData()

          const path: string = '/forms'

          router.prefetch(path)
          router.push(path)
        } else {
          setInfoMessage(loggedInClickHere)
        }
      }
    } catch {
      setInfoMessage(passwordError)
    }
  }

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setInfoMessage(null)
    setIsPasswordEmpty?.(false)

    const { name, value } = event.target

    const updatedFormData: FormData = new FormData({
      email: formData.getEmail(),
      userType: formData.getUserType(),
      password: name === 'password' ? value : (formData.getPassword() ?? ''),
    })

    setFormData(updatedFormData)
  }

  // an input type
  const typePassword: string = 'password'

  return (
    <>
      {isPasswordEmpty && (
        <Message
          params={{ type: '', text: infoMessageFromLoginClient ?? '' }}
        />
      )}
      {infoMessage && <Message params={{ type: '', text: infoMessage }} />}
      <Form params={{ onSubmit: handleLogin, method: 'post' }}>
        <Fieldset>
          <Fieldset>
            <Input
              params={{
                type: typePassword,
                id: typePassword,
                value: formData.getPassword() ?? '',
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: user !== null,
              }}
            />
            <Label
              params={{ htmlFor: typePassword, text: capitalize(typePassword) }}
            />
          </Fieldset>
        </Fieldset>
        <Button
          params={{
            type: ButtonType.Submit,
            text: 'Log In',
            disabled: user !== null,
          }}
        />
      </Form>
    </>
  )
}
