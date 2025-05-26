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

import Member from '@/lib/auth/companies/members/member'
import useAuthStore from '@/lib/auth/states/global/authStore'

import styles from './page.module.css'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import React, { useEffect, useState } from 'react'
import Modal from '@/components/shared/containers/modal/Modal'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Label from '@/components/shared/form/components/Label'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Company from '@/lib/auth/companies/company'
import Admin from '@/lib/auth/companies/admins/admin'
import { searchUsers } from '@/lib/utils/users-management/usersHandler'
import { updateMembers } from '@/lib/utils/users-management/companyHandler'
import Message from '@/components/shared/messages/Message'
import Article from '@/components/shared/containers/Article'

export default function Users() {
  // auth global state
  const { company, setCompany } = useAuthStore()

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const memberAdded: string = 'Member added successfully.'
  const memberAddingFailed: string = 'Failed to add member.'
  const memberRemoved: string = 'Member removed successfully.'
  const memberDeletionFailed: string = 'Failed to remove member.'

  // message type state
  const [messageType, setMessageType] = useState<string>('error')

  // modal state
  const [showModal, setShowModal] = useState<boolean>(false)

  // 'onClick' | modal
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // search member states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Member[]>([])

  // search users
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([])
        return
      }

      try {
        const excludesUuids: string[] = [
          ...(company?.getMembers()?.map((member) => member.getUuid()) ?? []),
          ...(company?.getAdmins()?.map((admin) => admin.getUuid()) ?? []),
        ]

        const foundUsers = await searchUsers(searchQuery, excludesUuids)

        const members: Member[] = foundUsers.map(
          (user: { uuid: string; fullName: string; email: string }) => {
            return new Member({
              uuid: user.uuid,
              fullName: user.fullName,
              email: user.email,
            })
          },
        )

        setSearchResults(members)
      } catch {
        setSearchResults([])
      }
    }

    search()
  }, [searchQuery, company])

  // 'onChange' | search members input
  const handleSearchAdminInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchQuery(event.target.value)
  }

  // 'onClick' | button '+' modal search results
  const handleAddingMembers = async (memberToAdd: Member) => {
    if (company) {
      const updatedMembers = [...(company.getMembers() ?? []), memberToAdd]

      try {
        const updatedCompanyData = await updateMembers(
          company.getUuid(),
          updatedMembers,
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
        setMessageType('successfully')
        setInfoMessage(memberAdded)
        setSearchQuery('')
      } catch {
        setMessageType('error')
        setInfoMessage(memberAddingFailed)
      }
    }
  }

  // handle members deletion
  const handleMembersDeletion = async (memberToRemove: Member) => {
    if (!company) return

    const updatedMembers = [
      ...(company.getMembers() ?? []).filter(
        (member) => member.getUuid() !== memberToRemove.getUuid(),
      ),
    ]

    console.log(
      'MEMBERS:',
      company.getMembers()?.map((m) => m.getUuid()),
    )
    console.log('REMOVING:', memberToRemove.getUuid())

    try {
      const updatedCompanyData = await updateMembers(
        company.getUuid(),
        updatedMembers,
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
      setMessageType('successfully')
      setInfoMessage(memberRemoved)
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage(memberDeletionFailed)
    }
  }

  // members
  const members: Member[] = company?.getMembers() ?? []

  return (
    <>
      <div className={styles.content}>
        {infoMessage && (
          <Message params={{ type: messageType, text: infoMessage }} />
        )}
        {!infoMessage && <div></div>}
        {members && members.length > 0 ? (
          <ul>
            {members.map((member) => (
              <li key={member.getUuid()}>
                <Article params={{ className: styles.member_card }}>
                  <div>
                    <Button
                      params={{
                        type: ButtonType.Button,
                        text: 'X',
                        onClick: () => handleMembersDeletion(member),
                      }}
                    />
                  </div>
                  <Article>
                    <SmallTitle params={{ text: member.getFullName() }} />
                    <p>{member.getEmail()}</p>
                  </Article>
                </Article>
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Add members',
            onClick: handleModalVisibility,
          }}
        />
      </div>
      {showModal && (
        <Modal params={{ setShowModal }}>
          <div className={styles.members_modal}>
            <Fieldset>
              <Input
                params={{
                  type: 'search',
                  id: 'search_member',
                  value: searchQuery,
                  onChange: handleSearchAdminInputChange,
                  placeholder: ' ',
                  required: false,
                  disabled: false,
                }}
              />
              <Label
                params={{
                  htmlFor: 'search_member',
                  text: 'Search member by name or email',
                }}
              />
            </Fieldset>
            <ul>
              {searchResults.length === 0 ? (
                <p>No results found.</p>
              ) : (
                searchResults.map((member) => (
                  <li key={member.getUuid()}>
                    <div>
                      <SmallTitle params={{ text: member.getFullName() }} />
                      <p>{member.getEmail()}</p>
                    </div>
                    <Button
                      params={{
                        type: ButtonType.Button,
                        text: '+',
                        onClick: () => handleAddingMembers(member),
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
