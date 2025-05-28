/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import Form from '@/components/shared/form/Form'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Button from '@/components/shared/form/components/Button'
import Label from '@/components/shared/form/components/Label'
import Title from '@/components/shared/titles/Title'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import Message from '@/components/shared/messages/Message'

import ButtonType from '@/lib/auth/forms/enums/buttonType'
import styles from './resetPasswordClient.module.css'

import { resetPassword } from '@/lib/utils/auth/authHandler'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [tokenValid, setTokenValid] = useState(true)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'error' | 'successfully'>(
    'error',
  )

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing token')
      setMessageType('error')
      setTokenValid(false)
    }
  }, [token])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!token) {
      setMessage('Missing token.')
      setMessageType('error')
      setTokenValid(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.')
      setMessageType('error')
      return
    }

    try {
      await resetPassword(token, newPassword)
      setMessageType('successfully')
      setMessage('Password reset successful. You can now log in.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setMessageType('error')
      setMessage(error.message ?? 'Something went wrong.')
      setTokenValid(false)
    }
  }

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className={styles.content}>
      <Title params={{ text: 'Reset Password', classNames: [''] }} />
      <div>
        <MediumTitle
          params={{ text: 'Set your new password', classNames: [''] }}
        />
        {message && <Message params={{ type: messageType, text: message }} />}
        <Form params={{ onSubmit: handleSubmit, method: 'post' }}>
          <div>
            <Fieldset params={{ className: styles.password_input }}>
              <div>
                <Input
                  params={{
                    type: showPassword ? 'text' : 'password',
                    id: 'new_password',
                    value: newPassword,
                    onChange: (e) => setNewPassword(e.target.value),
                    placeholder: ' ',
                    required: true,
                    disabled: !tokenValid,
                  }}
                />
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'Show Password',
                    onClick: togglePasswordVisibility,
                  }}
                />
              </div>
              <Label
                params={{ htmlFor: 'new_password', text: 'New Password' }}
              />
            </Fieldset>
            <Fieldset params={{ className: styles.password_input }}>
              <div>
                <Input
                  params={{
                    type: showConfirmPassword ? 'text' : 'password',
                    id: 'confirm_password',
                    value: confirmPassword,
                    onChange: (e) => setConfirmPassword(e.target.value),
                    placeholder: ' ',
                    required: true,
                    disabled: !tokenValid,
                  }}
                />
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'Show Password',
                    onClick: toggleConfirmPasswordVisibility,
                  }}
                />
              </div>
              <Label
                params={{
                  htmlFor: 'confirm_password',
                  text: 'Confirm Password',
                }}
              />
            </Fieldset>
          </div>
          <Button
            params={{
              type: ButtonType.Submit,
              text: 'Reset Password',
              disabled: !tokenValid,
            }}
          />
        </Form>
      </div>
    </div>
  )
}
