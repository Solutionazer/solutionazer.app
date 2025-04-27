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
import Fieldset from '../../shared/form/components/containers/fieldset/Fieldset'
import Input from '../../shared/form/components/Input'
import Form from '../../shared/form/Form'
import Label from '../../shared/form/components/Label'
import { capitalize } from '@/lib/utils/textHandler'
import FormData from '@/lib/forms/formData'
import useFormStore from '@/lib/forms/states/global/formStore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import Select from '../../shared/form/components/Select'
import Option from '@/lib/options/option'
import UserType from '@/lib/forms/enums/userType'
import {
  registerUser,
  userExists,
} from '@/lib/utils/users-management/usersHandler'
import { login } from '@/lib/utils/auth/authHandler'
import useAuthStore from '@/lib/forms/states/global/authStore'
import { useEffect, useState } from 'react'
import Message from '@/components/shared/messages/Message'

export default function RegisterForm() {
  // auth global state
  const { setUser } = useAuthStore()

  // formData global state
  const { formData, setFormData } = useFormStore()

  // configure router
  const router: AppRouterInstance = useRouter()

  // user type
  const userType: string = formData.getUserType()
  const isIndividual: boolean = userType === 'individual'

  // try to create an enterprise account before have an individual one?
  const [wasTryingToCreateEnterprise, setWasTryingToCreateEnterprise] =
    useState(false)

  // UI states
  const [showSkip, setShowSkip] = useState(false) // skip button
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const ifUserNotExists: string = `Change the account type from 'Enterprise' to 'Individual'. Before create an 'Enterprise' account, you have to have an 'Individual' account.`
  const ifUserExits: string = `Now, you can create your 'Enterprise' account. If you don't want to do this now, you can press the 'skip' button.`

  // check individual user existence
  useEffect(() => {
    const checkUserExistence = async () => {
      if (!isIndividual) {
        try {
          await userExists(formData.getEmail())

          setInfoMessage(ifUserExits)
        } catch {
          setInfoMessage(ifUserNotExists)
        }
      } else {
        setInfoMessage(null)
      }
    }

    checkUserExistence()
  }, [userType, formData.getEmail()])

  // 'onSubmit'
  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    if (isIndividual) {
      try {
        // register user
        await registerUser(
          formData.getFullName() ?? '',
          formData.getEmail(),
          formData.getPassword() ?? '',
        )

        // login
        const res = await login(
          formData.getEmail(),
          formData.getPassword() ?? '',
        )

        // update auth global state
        setUser(res.user)

        if (wasTryingToCreateEnterprise) {
          const updatedData: FormData = new FormData({
            email: formData.getEmail(),
            userType: UserType.Enterprise,
            password: formData.getPassword(),
            passwordToConfirm: formData.getPasswordToConfirm(),
            fullName: formData.getFullName(),
            companyName: formData.getCompanyName(),
          })

          setFormData(updatedData)
          setInfoMessage(ifUserExits)
          setShowSkip(true)
        } else {
          const path: string = '/forms'

          router.prefetch(path)
          router.push(path)
        }
      } catch {}
    }
  }

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const { name, value } = event.target

    if (!isIndividual) {
      setWasTryingToCreateEnterprise(true)
    }

    setFormData(createUpdatedFormData(name, value))
  }

  // create FormData (object) function to use into handleInputValuesChange
  const createUpdatedFormData = (name: string, value: string): FormData => {
    let updatedFullName: string | undefined
    let updatedCompanyName: string | undefined

    if (isIndividual) {
      updatedFullName = name === 'full_name' ? value : formData.getFullName()
      updatedCompanyName = ''
    } else {
      updatedCompanyName =
        name === 'company_name' ? value : formData.getCompanyName()
      updatedFullName = ''
    }

    return new FormData({
      email: formData.getEmail(),
      userType: name === 'user_type' ? value : userType,
      password: name === 'password' ? value : formData.getPassword(),
      passwordToConfirm:
        name === 'confirm_password' ? value : formData.getPasswordToConfirm(),
      fullName: updatedFullName,
      companyName: updatedCompanyName,
    })
  }

  // an input type
  const typePassword: string = 'password'

  // disable inputs?
  const disableFullName: boolean = !isIndividual
  const disableCompanyName: boolean = !(!isIndividual && showSkip)
  const disablePasswordField: boolean = !isIndividual

  return (
    <>
      {infoMessage && <Message params={{ type: '', text: infoMessage }} />}
      <Form params={{ onSubmit: handleRegister, method: 'post' }}>
        <Fieldset>
          <Fieldset>
            <Input
              params={{
                type: 'text',
                id: isIndividual ? 'full_name' : 'company_name',
                value: isIndividual
                  ? (formData.getFullName() ?? '')
                  : (formData.getCompanyName() ?? ''),
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: isIndividual ? disableFullName : disableCompanyName,
              }}
            />
            <Label
              params={{
                htmlFor: isIndividual ? 'full_name' : 'company_name',
                text: isIndividual ? 'Full Name' : 'Company Name',
              }}
            />
          </Fieldset>
          <Fieldset>
            <Input
              params={{
                type: typePassword,
                id: typePassword,
                value: formData.getPassword() ?? '',
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: disablePasswordField,
              }}
            />
            <Label
              params={{ htmlFor: typePassword, text: capitalize(typePassword) }}
            />
          </Fieldset>
          <Fieldset>
            <Input
              params={{
                type: typePassword,
                id: 'confirm_password',
                value: formData.getPasswordToConfirm() ?? '',
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: disablePasswordField,
              }}
            />
            <Label
              params={{
                htmlFor: 'confirm_password',
                text: `Confirm ${capitalize(typePassword)}`,
              }}
            />
          </Fieldset>
          <Fieldset>
            <Select
              params={{
                id: 'user_type',
                options: [
                  new Option(1, UserType.Individual),
                  new Option(3, UserType.Enterprise),
                ],
                value: userType,
                onChange: handleInputValuesChange,
                required: true,
              }}
            />
          </Fieldset>
        </Fieldset>
        <Button
          params={{
            type: ButtonType.Submit,
            text: 'Register',
          }}
        />
        {showSkip && (
          <Button
            params={{
              type: ButtonType.Submit,
              text: 'Skip',
            }}
          />
        )}
      </Form>
    </>
  )
}
