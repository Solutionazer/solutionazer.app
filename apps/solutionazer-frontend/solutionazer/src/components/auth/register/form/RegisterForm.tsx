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
import useFormStore from '@/lib/auth/forms/states/global/formStore'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter, useSearchParams } from 'next/navigation'
import Option from '@/lib/options/option'
import UserType from '@/lib/auth/forms/enums/userType'
import {
  registerUser,
  userExists,
} from '@/lib/utils/users-management/usersHandler'
import { login } from '@/lib/utils/auth/authHandler'
import useAuthStore from '@/lib/auth/states/global/authStore'
import { useEffect, useState } from 'react'
import Message from '@/components/shared/messages/Message'
import { registerCompany } from '@/lib/utils/users-management/companyHandler'
import AuthUser from '@/lib/auth/authUser'
import Form from '@/components/shared/form/Form'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Label from '@/components/shared/form/components/Label'
import Select from '@/components/shared/form/components/Select'
import Button from '@/components/shared/form/components/Button'

import styles from './registerForm.module.css'

export default function RegisterForm() {
  // query params
  const params = useSearchParams()

  // userType through query params
  const userTypeByParams: string | null = params.get('userType')

  // auth global state
  const { user, setUser } = useAuthStore()

  // formData global state
  const { formData, setFormData, resetFormData } = useFormStore()

  // configure router
  const router: AppRouterInstance = useRouter()

  // user type
  const userType: string = formData.getUserType()
  const isIndividual: boolean = userType === 'individual'

  // try to create an enterprise account before have an individual one?
  const [wasTryingToCreateEnterprise, setWasTryingToCreateEnterprise] =
    useState(false)

  // skip button state
  const [isSkipPressed, setIsSkipPressed] = useState<boolean>(false)

  // UI states
  const [showSkip, setShowSkip] = useState(false) // skip button
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // message type state
  const [messageType, setMessageType] = useState<string>('error')

  // messages
  const ifUserNotExists: string = `To create an 'Enterprise' account, you must first switch your account type to 'Individual'. Only after that can you create an 'Enterprise' account.`
  const ifUserExists: string = `You can now create your 'Enterprise' account. If you'd prefer to skip this step, simply press the 'Skip' button.`
  const passwordError: string =
    'Passwords do not match. Please make sure both password fields are identical.'

  // userTypeByParams formData load
  useEffect(() => {
    if (userTypeByParams) {
      const updatedFormData: FormData = new FormData({
        email: formData.getEmail(),
        userType: UserType.Enterprise,
      })

      setFormData(updatedFormData)
    }
  }, [userTypeByParams, setFormData])

  // check individual user existence
  useEffect(() => {
    const checkUserExistence = async () => {
      if (!isIndividual && !user) {
        try {
          await userExists(formData.getEmail())

          if (!userTypeByParams) {
            setMessageType('successfully')
            setInfoMessage(ifUserExists)
          }
        } catch {
          setMessageType('error')
          setInfoMessage(ifUserNotExists)
        }
      } else {
        if (infoMessage !== ifUserExists) {
          setInfoMessage(null)
        }
      }
    }

    checkUserExistence()
  }, [
    user,
    userType,
    formData,
    ifUserExists,
    ifUserNotExists,
    isIndividual,
    userTypeByParams,
    infoMessage,
  ])

  // 'onSubmit'
  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    if (formData.getPassword() !== formData.getPasswordToConfirm()) {
      setMessageType('error')
      setInfoMessage(passwordError)
      return
    } else {
      setInfoMessage(null)
    }

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
        setUser(
          new AuthUser({
            uuid: res.user.uuid,
            fullName: res.user.fullName,
            email: res.user.email,
          }),
        )

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
          setMessageType('successfully')
          setInfoMessage(ifUserExists)
          setShowSkip(true)
        } else {
          resetFormData()

          const path: string = '/forms'

          router.prefetch(path)
          router.push(path)
        }
      } catch {}
    } else {
      await registerCompany(formData.getCompanyName() ?? '', [
        { uuid: user?.getUuid() ?? '' },
      ])

      resetFormData()

      const path: string = '/profiles'

      router.prefetch(path)
      router.push(path)
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

  // 'onClick' | skip button
  const handleSkip = () => {
    setIsSkipPressed(true)

    const path: string = '/forms'

    router.prefetch(path)
    router.push(path)
  }

  // show password state
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // an input type
  const typePassword: string = 'password'

  // disable inputs?
  const disableFullName: boolean = !isIndividual
  const disableCompanyName: boolean = userTypeByParams
    ? false
    : !(!isIndividual && showSkip)

  return (
    <>
      {infoMessage && (
        <Message params={{ type: messageType, text: infoMessage }} />
      )}
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
                required: !isSkipPressed,
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
          {isIndividual && (
            <>
              <Fieldset params={{ className: styles.password_input }}>
                <div>
                  <Input
                    params={{
                      type: showPassword ? 'text' : typePassword,
                      id: typePassword,
                      value: formData.getPassword() ?? '',
                      minLength: 8,
                      maxLength: 32,
                      pattern:
                        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,32}$',
                      title:
                        'Password must be 8–32 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
                      onChange: handleInputValuesChange,
                      placeholder: ' ',
                      required: true,
                      disabled: false,
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
                  params={{
                    htmlFor: typePassword,
                    text: capitalize(typePassword),
                  }}
                />
              </Fieldset>
              <Fieldset params={{ className: styles.password_input }}>
                <div>
                  <Input
                    params={{
                      type: showConfirmPassword ? 'text' : typePassword,
                      id: 'confirm_password',
                      value: formData.getPasswordToConfirm() ?? '',
                      onChange: handleInputValuesChange,
                      placeholder: ' ',
                      required: true,
                      disabled: false,
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
                    text: `Confirm ${capitalize(typePassword)}`,
                  }}
                />
              </Fieldset>
            </>
          )}
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
                disabled: false,
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
              type: ButtonType.Button,
              text: 'Skip',
              onClick: handleSkip,
            }}
          />
        )}
      </Form>
    </>
  )
}
