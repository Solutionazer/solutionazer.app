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

import ButtonType from '@/lib/forms/enums/buttonType'
import Button from '../../shared/form/components/Button'
import Input from '../../shared/form/components/Input'
import Form from '../../shared/form/Form'
import Fieldset from '../../shared/form/components/containers/fieldset/Fieldset'
import Label from '../../shared/form/components/Label'
import { capitalize } from '@/lib/utils/textHandler'
import FormData from '@/lib/forms/formData'
import useFormStore from '@/lib/forms/states/global/formStore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/utils/auth/authHandler'
import useAuthStore from '@/lib/forms/states/global/authStore'

export default function LoginForm() {
  // auth global state
  const { setUser } = useAuthStore()

  // formData global state
  const { formData, setFormData } = useFormStore()

  // configure router
  const router: AppRouterInstance = useRouter()

  // 'onSubmit'
  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()
    try {
      const res = await login(formData.getEmail(), formData.getPassword() ?? '')

      setUser(res.user)

      const path: string = '/forms'

      router.prefetch(path)
      router.push(path)
    } catch {}
  }

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
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
              disabled: false,
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
        }}
      />
    </Form>
  )
}
