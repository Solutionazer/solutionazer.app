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

/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import useDataCollector from '@/lib/module/data-collectors/states/global/dataCollectorStore'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import {
  cloneFormToUser,
  getFormClonesByFormUuid,
  undoCloneForm,
  updateFormDescription,
} from '@/lib/utils/data-collectors/formsHandler'
import {
  cloneSurveyToUser,
  getSurveyClonesBySurveyUuid,
  undoCloneSurvey,
  updateSurveyDescription,
} from '@/lib/utils/data-collectors/surveysHandler'
import Label from '@/components/shared/form/components/Label'
import Input from '@/components/shared/form/components/Input'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Modal from '@/components/shared/containers/modal/Modal'
import TeamMember from '@/lib/teams/members/team-member'
import { searchUsersInSameTeam } from '@/lib/utils/users-management/usersHandler'
import useAuthStore from '@/lib/auth/states/global/authStore'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import Article from '@/components/shared/containers/Article'
import DataCollector from '@/lib/module/data-collectors/dataCollector'
import Message from '@/components/shared/messages/Message'

type ClonedMember = {
  clonedDataCollectorUuid: string
  member: TeamMember
}

export default function Data() {
  // dataCollector global state
  const { dataCollector } = useDataCollector()

  const dataCollectorAny: any = dataCollector

  // auth global state
  const { user } = useAuthStore()

  // user uuid
  const userUuid = user?.getUuid?.()

  // description state
  const [description, setDescription] = useState('')

  // load description
  useEffect(() => {
    if (dataCollector) {
      const instance: DataCollector = new DataCollector({
        uuid: dataCollectorAny.uuid,
        title: dataCollectorAny.title,
        description: dataCollectorAny.description,
        type: dataCollectorAny.type,
        isPublished: dataCollectorAny.isPublished,
        createdAt: dataCollectorAny.createdAt,
        updatedAt: dataCollectorAny.updatedAt,
      })

      setDescription(instance?.getDescription?.() ?? '')
    }
  }, [dataCollector])

  // handle description blur
  const handleDescriptionBlur = async () => {
    const type = dataCollector?.getType()
    const uuid = dataCollector?.getUuid()

    if (!uuid || !type) return

    try {
      if (type === 'form') {
        await updateFormDescription(uuid, description)
      } else if (type === 'survey') {
        await updateSurveyDescription(uuid, description)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // modal state
  const [showModal, setShowModal] = useState<boolean>(false)

  // 'onClick' | modal
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages
  // message type state
  const [messageType, setMessageType] = useState<string>('error')

  // search member states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<TeamMember[]>([])

  // search users
  useEffect(() => {
    const search = async () => {
      if (!userUuid || searchQuery.length < 3) {
        setSearchResults([])
        return
      }

      try {
        const excludesUuids: string[] = [userUuid]

        const foundUsers = await searchUsersInSameTeam(
          userUuid,
          searchQuery,
          excludesUuids,
        )

        const members: TeamMember[] = foundUsers.map(
          (user: { uuid: string; fullName: string; email: string }) => {
            return new TeamMember({
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
  }, [searchQuery, userUuid])

  // 'onChange' | search members input
  const handleSearchAdminInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchQuery(event.target.value)
  }

  // clone form state
  const [clonedMembers, setClonedMembers] = useState<ClonedMember[]>([])

  // load clones
  useEffect(() => {
    const fetchClones = async () => {
      const instance: DataCollector = new DataCollector({
        uuid: dataCollectorAny?.uuid,
        title: dataCollectorAny?.title,
        description: dataCollectorAny?.description,
        type: dataCollectorAny?.type,
        isPublished: dataCollectorAny?.isPublished,
        createdAt: dataCollectorAny?.createdAt,
        updatedAt: dataCollectorAny?.updatedAt,
      })

      if ((instance?.getType?.() ?? '') === 'form') {
        const formUuid = instance?.getUuid() ?? ''

        try {
          const clones = (await getFormClonesByFormUuid(formUuid)).map(
            (res: any) => {
              return {
                clonedDataCollectorUuid: res.clonedFormUuid,
                member: new TeamMember({
                  uuid: res.member.uuid,
                  fullName: res.member.fullName,
                  email: res.member.email,
                }),
              }
            },
          )

          setClonedMembers(clones)
        } catch (error) {
          console.error(error)
        }
      } else if ((instance?.getType?.() ?? '') === 'survey') {
        const surveyUuid = instance?.getUuid() ?? ''

        try {
          const clones = (await getSurveyClonesBySurveyUuid(surveyUuid)).map(
            (res: any) => {
              return {
                clonedDataCollectorUuid: res.clonedSurveyUuid,
                member: new TeamMember({
                  uuid: res.member.uuid,
                  fullName: res.member.fullName,
                  email: res.member.email,
                }),
              }
            },
          )

          setClonedMembers(clones)
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchClones()
  }, [dataCollector])

  // 'onClick' | button '+' modal search results
  const handleAddingMembers = async (memberToAdd: TeamMember) => {
    const dataCollectorUUid = dataCollector?.getUuid?.()
    const type = dataCollector?.getType?.()

    if (!dataCollectorUUid || !type) return

    const targetUserUuid = memberToAdd.getUuid()

    try {
      let clonedUuid: string | null = null

      if (type === 'form') {
        const res = await cloneFormToUser(dataCollectorUUid, targetUserUuid)

        console.log(res)

        clonedUuid = res.clonedForm.uuid
      } else if (type === 'survey') {
        const res = await cloneSurveyToUser(dataCollectorUUid, targetUserUuid)

        console.log(res)

        clonedUuid = res.clonedSurvey.uuid
      } else {
        throw new Error('Unsupported dataCollector type')
      }

      if (clonedUuid) {
        setClonedMembers((prev) => [
          ...prev,
          { clonedDataCollectorUuid: clonedUuid, member: memberToAdd },
        ])

        setMessageType('successfully')
        setInfoMessage(
          `${memberToAdd.getFullName()} added by cloning the ${type}`,
        )
        setSearchQuery('')
      }
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage(`Failed to clone ${type} to the user`)
    }
  }

  // handle members deletion
  const handleMembersDeletion = async (
    clonedDataCollectorUuidToRemove: string,
    memberToRemove: TeamMember,
  ) => {
    try {
      const type = dataCollector?.getType() ?? ''

      if (!type) return

      if (type === 'form') {
        await undoCloneForm(clonedDataCollectorUuidToRemove)
      } else if (type === 'survey') {
        await undoCloneSurvey(clonedDataCollectorUuidToRemove)
      }

      setClonedMembers((prev) =>
        prev.filter(
          ({ clonedDataCollectorUuid }) =>
            clonedDataCollectorUuid !== clonedDataCollectorUuidToRemove,
        ),
      )

      setMessageType('successfully')
      setInfoMessage(`${memberToRemove.getFullName()} removed and clone undone`)
    } catch (error) {
      console.error(error)

      setInfoMessage('Failed to remove the member or undo clone')
      setMessageType('error')
    }
  }

  return (
    <>
      <div className={styles.content}>
        {infoMessage && (
          <Message params={{ type: messageType, text: infoMessage }} />
        )}
        {!infoMessage && <div></div>}
        <SmallTitle
          params={{
            text: `Edit the ${dataCollectorAny?.getType?.() === 'form' ? 'form' : dataCollectorAny?.getType?.() === 'survey' ? 'survey' : ''} description:`,
          }}
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={handleDescriptionBlur}
        ></textarea>

        <SmallTitle params={{ text: 'Cloned to...' }} />
        <div className={styles.cloned_members_list}>
          {clonedMembers.length === 0 ? (
            <p>No members cloned yet.</p>
          ) : (
            <ul>
              {clonedMembers.map(({ clonedDataCollectorUuid, member }) => (
                <li key={clonedDataCollectorUuid}>
                  <Article
                    key={clonedDataCollectorUuid}
                    params={{ className: styles.member_card }}
                  >
                    <div>
                      <Button
                        params={{
                          type: ButtonType.Button,
                          text: 'X',
                          onClick: () =>
                            handleMembersDeletion(
                              clonedDataCollectorUuid,
                              member,
                            ),
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
          )}
        </div>

        <div className={styles.add_member_btn_container}>
          <Button
            params={{
              type: ButtonType.Button,
              text: 'Add member',
              onClick: handleModalVisibility,
              className: styles.add_member_btn,
            }}
          />
        </div>
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
