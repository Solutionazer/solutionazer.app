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
import Message from '@/components/shared/messages/Message'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import FormData from '@/lib/auth/forms/formData'
import useFormStore from '@/lib/auth/forms/states/global/formStore'
import useAuthStore from '@/lib/auth/states/global/authStore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import styles from './page.module.css'
import Card from '@/components/companies/card/Card'
import { updateCompany } from '@/lib/utils/users-management/companyHandler'
import Company from '@/lib/auth/companies/company'
import Admin from '@/lib/auth/companies/admins/admin'

export default function CompanyPage() {
  // auth global state
  const { company, setCompany } = useAuthStore()

  // formData global state
  const { formData, setFormData } = useFormStore()

  // set initial formData
  useEffect(() => {
    if (company) {
      const initialFormData = new FormData({
        email: '',
        userType: '',
        companyName: company.getName(),
      })

      setFormData(initialFormData)
    }
  }, [company, setFormData])

  // 'onSubmit'
  const handleCompanyEdition: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault()

    if (company) {
      try {
        const updatedCompanyData = await updateCompany(
          company.getUuid(),
          formData.getCompanyName() ?? '',
        )

        const updatedCompany: Company = new Company({
          uuid: updatedCompanyData.uuid,
          name: updatedCompanyData.name,
          admins: updatedCompanyData.admins.map(
            (admin: { uuid: string; fullName: string; email: string }) => {
              return new Admin({
                uuid: admin.uuid,
                fullName: admin.fullName,
                email: admin.email,
              })
            },
          ),
        })

        setCompany(updatedCompany)
        setInfoMessage(companyUpdated)
      } catch {
        setInfoMessage(companyUpdateFailed)
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
      email: '',
      userType: '',
      companyName: name === 'company_name' ? value : formData.getCompanyName(),
    })
  }

  // 'onReset'
  const handleFormReset: React.FormEventHandler<HTMLFormElement> = () => {
    const initialFormData = new FormData({
      email: '',
      userType: '',
      companyName: company?.getName(),
    })

    setFormData(initialFormData)
    setInfoMessage(null)
  }

  // 'onDelete' | admins
  const handleAdminsDeletion = () => {}

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const companyUpdated: string = `Company updated successfully!`
  const companyUpdateFailed: string = `Failed to updated company.`

  return (
    <Article params={{ className: styles.article }}>
      <div className={styles.auth_btn_container}>
        <Link href="/profiles" className={styles.profiles_btn}>
          Profiles
        </Link>
      </div>
      <MediumTitle params={{ text: 'Company Data', classNames: [] }} />
      <Form
        params={{
          onSubmit: handleCompanyEdition,
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
                id: 'company_name',
                value: formData.getCompanyName() ?? '',
                onChange: handleInputValuesChange,
                placeholder: ' ',
                required: true,
                disabled: false,
              }}
            />
            <Label params={{ htmlFor: 'company_name', text: 'Company Name' }} />
          </Fieldset>
        </Fieldset>
        <Fieldset params={{ className: styles.buttons_container }}>
          <Button params={{ type: ButtonType.Reset, text: 'Reset' }} />
          <Button params={{ type: ButtonType.Submit, text: 'Save' }} />
        </Fieldset>
      </Form>
      <Article params={{ className: styles.admins_container }}>
        <MediumTitle params={{ text: 'Admins', classNames: [] }} />
        {company?.getAdmins()?.length ? (
          <ul>
            {company.getAdmins()?.map((admin) => (
              <li key={admin.getUuid()}>
                <Card params={{ admin, onDelete: handleAdminsDeletion }} />
              </li>
            ))}
          </ul>
        ) : (
          <ul></ul>
        )}
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Add admin',
            className: styles.admin_btn,
          }}
        />
      </Article>
    </Article>
  )
}
