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

export default function Account() {
  // formData global state
  const { formData, setFormData } = useFormStore()

  // user type
  const userType: string = formData.getUserType()
  const isIndividual: boolean = userType === 'individual'

  // 'onSubmit'
  const handleAccountEdition: React.FormEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault()
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
      email: name === 'email' ? value : formData.getEmail(),
      userType: name === 'user_type' ? value : userType,
      password: formData.getPassword(),
      passwordToConfirm: formData.getPasswordToConfirm(),
      fullName: updatedFullName,
      companyName: updatedCompanyName,
    })
  }

  return (
    <Article params={{ className: styles.article }}>
      <Form params={{ onSubmit: handleAccountEdition, method: 'post' }}>
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
                type: 'email',
                id: 'email',
                value: formData.getEmail(),
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
              }}
            />
            <Label params={{ htmlFor: 'email', text: 'Email' }} />
          </Fieldset>
          <Fieldset>
            <Select
              params={{
                id: 'user_type',
                options: [
                  new Option(1, UserType.Individual),
                  new Option(2, UserType.Enterprise),
                ],
                value: userType,
                onChange: handleInputValuesChange,
                required: true,
              }}
            />
          </Fieldset>
        </Fieldset>
        <Fieldset params={{ className: styles.buttons_container }}>
          <Button
            params={{
              type: ButtonType.Submit,
              text: 'Save',
            }}
          />
          <Button
            params={{
              type: ButtonType.Reset,
              text: 'Reset',
            }}
          />
        </Fieldset>
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Reset Password',
          }}
        />
      </Form>
    </Article>
  )
}
