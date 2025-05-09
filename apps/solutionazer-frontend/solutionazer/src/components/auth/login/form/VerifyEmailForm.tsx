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
import { capitalize } from '@/lib/utils/textHandler'
import FormData from '@/lib/auth/forms/formData'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import useFormStore from '@/lib/auth/forms/states/global/formStore'
import UserType from '@/lib/auth/forms/enums/userType'
import { userExists } from '@/lib/utils/users-management/usersHandler'
import Form from '@/components/shared/form/Form'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Label from '@/components/shared/form/components/Label'
import Button from '@/components/shared/form/components/Button'

export default function VerifyEmailForm() {
  // props
  const { formData, setFormData } = useFormStore()

  // configure router
  const router: AppRouterInstance = useRouter()

  // 'onSubmit'
  const handleEmailVerification: React.FormEventHandler<
    HTMLFormElement
  > = async (event) => {
    event.preventDefault()

    try {
      await userExists(formData.getEmail())

      const path: string = '/login?context='

      router.prefetch(path)
      router.push(path)
    } catch {
      const path: string = '/register'

      router.prefetch(path)
      router.push(path)
    }
  }

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { name, value } = event.target

    const updatedFormData: FormData = new FormData({
      email: name === 'email' ? value : formData.getEmail(),
      userType: UserType.Individual,
    })

    setFormData(updatedFormData)
  }

  // an input type
  const typeEmail: string = 'email'

  return (
    <Form params={{ onSubmit: handleEmailVerification, method: 'post' }}>
      <Fieldset>
        <Fieldset>
          <Input
            params={{
              type: typeEmail,
              id: typeEmail,
              value: formData.getEmail() ?? '',
              onChange: handleInputValuesChange,
              placeholder: ' ',
              required: true,
              disabled: false,
            }}
          />
          <Label params={{ htmlFor: typeEmail, text: capitalize(typeEmail) }} />
        </Fieldset>
      </Fieldset>
      <Button
        params={{
          type: ButtonType.Submit,
          text: 'Continue',
        }}
      />
    </Form>
  )
}
