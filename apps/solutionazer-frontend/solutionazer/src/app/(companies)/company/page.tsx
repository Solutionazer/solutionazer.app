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
import React, { useEffect, useState } from 'react'

import styles from './page.module.css'
import Card from '@/components/companies/card/Card'
import {
  updateAdmins,
  updateCompany,
} from '@/lib/utils/users-management/companyHandler'
import Company from '@/lib/auth/companies/company'
import Admin from '@/lib/auth/companies/admins/admin'
import Modal from '@/components/shared/containers/modal/Modal'
import { searchUsers } from '@/lib/utils/users-management/usersHandler'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Member from '@/lib/auth/companies/members/member'
import Image from 'next/image'

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

        console.log(updatedCompanyData)

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
          members: updatedCompanyData.members.map(
            (member: { uuid: string; fullName: string; email: string }) => {
              return new Member({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            },
          ),
        })

        setCompany(updatedCompany)
        setInfoMessage(companyUpdated)
        setMessageType('company')
      } catch (error) {
        console.error(error)

        setInfoMessage(companyUpdateFailed)
        setMessageType('company')
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
    setMessageType(null)
  }

  // 'onDelete' | admins
  const handleAdminsDeletion = async (adminUuid: string) => {
    if (company && company.getAdmins()?.length === 1) {
      setInfoMessage(cannotDeleteAdmin)
      setMessageType('admin')
    } else if (company) {
      const updatedAdmins = company
        .getAdmins()
        ?.filter((admin) => admin.getUuid() !== adminUuid)

      try {
        const updatedCompanyData = await updateAdmins(
          company?.getUuid() ?? '',
          updatedAdmins ?? [],
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
          members: updatedCompanyData.members.map(
            (member: { uuid: string; fullName: string; email: string }) => {
              return new Member({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            },
          ),
        })

        setCompany(updatedCompany)
        setInfoMessage(adminDeleted)
        setMessageType('admin')
      } catch {
        setInfoMessage(adminDeletionFailed)
        setMessageType('admin')
      }
    }
  }

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages
  const [messageType, setMessageType] = useState<'company' | 'admin' | null>(
    null,
  ) // message types

  // messages
  const companyUpdated: string = 'Company updated successfully!'
  const companyUpdateFailed: string = 'Failed to updated company.'
  const cannotDeleteAdmin: string =
    'To remove an administrator, the company must have more than one.'
  const adminDeleted: string = 'Admin deleted successfully.'
  const adminDeletionFailed: string = 'Failed to delete admin.'
  const adminAdded: string = 'Admin added successfully!'
  const adminAddingFailed: string = 'Failed to add admin.'

  // modal state
  const [showModal, setShowModal] = useState<boolean>(false)

  // 'onClick' | modal
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // search admin states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Admin[]>([])

  // search users
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([])
        return
      }

      try {
        const excludesUuids: string[] =
          company?.getAdmins()?.map((admin) => admin.getUuid()) ?? []

        const foundUsers = await searchUsers(searchQuery, excludesUuids)

        const admins = foundUsers.map(
          (user: { uuid: string; fullName: string; email: string }) => {
            return new Admin({
              uuid: user.uuid,
              fullName: user.fullName,
              email: user.email,
            })
          },
        )

        setSearchResults(admins)
      } catch {
        setSearchResults([])
      }
    }

    search()
  }, [searchQuery, company])

  // 'onChange' | search admins input
  const handleSearchAdminInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchQuery(event.target.value)
  }

  // 'onClick' | button '+' modal search results
  const handleAddingAdmins = async (adminToAdd: Admin) => {
    if (company) {
      const updatedAdmins = [...(company.getAdmins() ?? []), adminToAdd]

      try {
        const updatedCompanyData = await updateAdmins(
          company.getUuid(),
          updatedAdmins,
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
          members: updatedCompanyData.members.map(
            (member: { uuid: string; fullName: string; email: string }) => {
              return new Member({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            },
          ),
        })

        setCompany(updatedCompany)
        setInfoMessage(adminAdded)
        setMessageType('admin')
        setShowModal(false)
        setSearchQuery('')
      } catch {
        setInfoMessage(adminAddingFailed)
        setMessageType('admin')
      }
    }
  }

  return (
    <>
      <Article params={{ className: styles.article }}>
        <div className={styles.auth_btn_container}>
          <Link href="/profiles" className={styles.profiles_btn}>
            <Image
              src="/icons/black_profiles.svg"
              alt="profiles button"
              width={22}
              height={22}
            />
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
            {messageType === 'company' && infoMessage && (
              <Message params={{ type: '', text: infoMessage }} />
            )}
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
              <Label
                params={{ htmlFor: 'company_name', text: 'Company Name' }}
              />
            </Fieldset>
          </Fieldset>
          <Fieldset params={{ className: styles.buttons_container }}>
            <Button params={{ type: ButtonType.Reset, text: 'Reset' }} />
            <Button params={{ type: ButtonType.Submit, text: 'Save' }} />
          </Fieldset>
        </Form>
        <Article params={{ className: styles.admins_container }}>
          <MediumTitle params={{ text: 'Admins', classNames: [] }} />
          {messageType === 'admin' && infoMessage && (
            <Message params={{ type: '', text: infoMessage }} />
          )}
          {company?.getAdmins()?.length ? (
            <ul>
              {company.getAdmins()?.map((admin) => (
                <li key={admin.getUuid()}>
                  <Card
                    params={{
                      admin,
                      onDelete: () => handleAdminsDeletion(admin.getUuid()),
                    }}
                  />
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
              onClick: handleModalVisibility,
              className: styles.admin_btn,
            }}
          />
        </Article>
      </Article>
      {showModal && (
        <Modal params={{ setShowModal }}>
          <div className={styles.admins_modal}>
            <Fieldset>
              <Input
                params={{
                  type: 'search',
                  id: 'search_admin',
                  value: searchQuery,
                  onChange: handleSearchAdminInputChange,
                  placeholder: ' ',
                  required: false,
                  disabled: false,
                }}
              />
              <Label
                params={{
                  htmlFor: 'search_admin',
                  text: 'Search admin by name or email',
                }}
              />
            </Fieldset>
            <ul>
              {searchResults.length === 0 ? (
                <p>No results found.</p>
              ) : (
                searchResults.map((admin) => (
                  <li key={admin.getUuid()}>
                    <div>
                      <SmallTitle params={{ text: admin.getFullName() }} />
                      <p>{admin.getEmail()}</p>
                    </div>
                    <Button
                      params={{
                        type: ButtonType.Button,
                        text: '+',
                        onClick: () => handleAddingAdmins(admin),
                      }}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
        </Modal>
      )}
    </>
  )
}
