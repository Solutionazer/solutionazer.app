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

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Form from '@/components/shared/form/Form'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Button from '@/components/shared/form/components/Button'
import Message from '@/components/shared/messages/Message'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { sendPasswordRecoveryEmail } from '@/lib/utils/auth/authHandler'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const [messageType, setMessageType] = useState<string>('error')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      await sendPasswordRecoveryEmail(email)
      setMessageType('successfully')
      setMessage('Recovery email sent. Check your inbox.')
    } catch {
      setMessageType('error')
      setMessage('There was a problem sending the recovery email.')
    }
  }

  return (
    <>
      {message && <Message params={{ type: messageType, text: message }} />}
      <Form params={{ onSubmit: handleSubmit, method: 'post' }}>
        <Fieldset>
          <Input
            params={{
              type: 'email',
              id: 'recoveryEmail',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: 'Enter your email',
              required: true,
              disabled: false,
            }}
          />
        </Fieldset>
        <Button
          params={{ type: ButtonType.Submit, text: 'Send Recovery Email' }}
        />
      </Form>
    </>
  )
}
