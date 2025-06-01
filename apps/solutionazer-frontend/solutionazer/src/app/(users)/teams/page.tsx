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

import useAuthStore from '@/lib/auth/states/global/authStore'
import styles from './page.module.css'
import {
  createFreelanceTeam,
  getTeamsByUser,
  updateTeamMembers,
  updateTeamTitle,
} from '@/lib/utils/users-management/teamsHandler'
import { useEffect, useState } from 'react'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import Article from '@/components/shared/containers/Article'
import Team from '@/lib/teams/team'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import TeamMember from '@/lib/teams/members/team-member'
import Input from '@/components/shared/form/components/Input'
import Label from '@/components/shared/form/components/Label'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import Modal from '@/components/shared/containers/modal/Modal'
import { searchUsers } from '@/lib/utils/users-management/usersHandler'
import Message from '@/components/shared/messages/Message'

export default function Route() {
  // auth global state
  const { user } = useAuthStore()

  // teams state
  const [teams, setTeams] = useState<Team[]>([])

  // selected team state
  const [selectedTeam /*, setSelectedTeam*/] = useState<Team | null>(null)

  // freelance config state
  const [freelanceConfigOpen, setFreelanceConfigOpen] = useState<boolean>(false)

  // load teams
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userUuid: string = user.getUuid() ?? ''

        console.log(await getTeamsByUser(userUuid))

        const fetchedTeams: Team[] = (await getTeamsByUser(userUuid)).map(
          (team: {
            uuid: string
            name: string
            type: string
            members: TeamMember[]
            owner: any
          }) => {
            return new Team({
              uuid: team.uuid,
              name: team.name,
              type: team.type,
              members:
                team.members.map((member: any) => {
                  return new TeamMember({
                    uuid: member.uuid,
                    fullName: member.fullName,
                    email: member.email,
                  })
                }) ?? [],
              owner: {
                uuid: team.owner?.uuid,
                fullName: team.owner?.fullName,
                email: team.owner?.email,
              },
            })
          },
        )

        setTeams(fetchedTeams)
      }
    }

    fetchData()
  }, [user])

  // team types
  const freelanceTeam = teams.find(
    (team) =>
      team.getType() === 'freelance-own' &&
      team.getOwner()?.uuid === user?.getUuid(),
  )
  const companyTeams = teams.filter((team) => team.getType() === 'company-own')
  const externalTeams = teams.filter(
    (team) =>
      team.getType() === 'freelance-own' &&
      team.getOwner()?.uuid !== user?.getUuid() &&
      team.getMembers().some((member) => member.getUuid() === user?.getUuid()),
  )

  // 'onClick' | freelance team creation
  const handleFreelanceTeamCreation = async () => {
    try {
      const owner: string = user?.getUuid() ?? ''
      const name: string = `${user?.getFullName()?.split(' ')[0]}'s Team`

      await createFreelanceTeam(name, owner)

      const updatedTeams = await getTeamsByUser(owner)

      const mappedTeams: Team[] = updatedTeams.map((team: any) => {
        return new Team({
          uuid: team.uuid,
          name: team.name,
          type: team.type,
          members:
            team.members.map((member: any) => {
              return new TeamMember({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            }) ?? [],
        })
      })

      setTeams(mappedTeams)
    } catch {}
  }

  // title state
  const [title, setTitle] = useState('')

  // synchronize dataCollector title with local title
  useEffect(() => {
    if (freelanceTeam) {
      setTitle(freelanceTeam.getName())
    }
  }, [freelanceTeam])

  // 'onChange'
  const handleInputValuesChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setTitle(event.target.value)
  }

  // blur
  const handleBlur = async () => {
    if (!freelanceTeam) return

    const newTitle: string = title.trim()

    if (newTitle !== freelanceTeam.getName()) {
      try {
        await updateTeamTitle(freelanceTeam.getUuid(), newTitle)

        setTitle(newTitle)
      } catch {}
    }
  }

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // message type state
  const [messageType, setMessageType] = useState<string>('error')

  // messages
  const memberAdded: string = 'Member added successfully!'
  const memberAddingFailed: string = 'Failed to add member.'

  // add member modal state
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false)

  // 'onClick' | add member modal
  const handleAddMemberModalVisibility = () => {
    setShowAddMemberModal(true)
  }

  // search members states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<TeamMember[]>([])

  // search users
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([])
        return
      }

      try {
        const excludesUuids: string[] =
          freelanceTeam?.getMembers().map((member) => member.getUuid()) ?? []

        const foundUsers = await searchUsers(searchQuery, excludesUuids)

        const members = foundUsers.map(
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
  }, [searchQuery, freelanceTeam])

  // 'onChange' | search members input
  const handleSearchMemberInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchQuery(event.target.value)
  }

  // 'onClick' | button '+' modal search results
  const handleAddingMembers = async (memberToAdd: TeamMember) => {
    if (freelanceTeam) {
      const updatedMembers = [...freelanceTeam.getMembers(), memberToAdd]

      try {
        await updateTeamMembers(
          freelanceTeam?.getUuid(),
          updatedMembers.map((member) => ({
            uuid: member.getUuid(),
            fullName: member.getFullName(),
            email: member.getEmail(),
          })),
        )
        await reloadTeams()

        setMessageType('successfully')
        setInfoMessage(memberAdded)
        setShowAddMemberModal(false)
        setSearchQuery('')
      } catch {
        setMessageType('error')
        setInfoMessage(memberAddingFailed)
      }
    }
  }

  // reload teams
  const reloadTeams = async () => {
    if (user) {
      const userUuid: string = user.getUuid() ?? ''
      const updatedTeams = await getTeamsByUser(userUuid)

      console.log(updatedTeams)

      const mappedTeams: Team[] = updatedTeams.map((team: any) => {
        return new Team({
          uuid: team.uuid,
          name: team.name,
          type: team.type,
          members:
            team.members.map((member: any) => {
              return new TeamMember({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            }) ?? [],
          owner: {
            uuid: team.owner?.uuid,
            fullName: team.owner?.fullName,
            email: team.owner?.email,
          },
        })
      })

      setTeams(mappedTeams)
    }
  }

  // remove member freelance team
  const handleRemoveMember = async (memberToRemove: TeamMember) => {
    if (!freelanceTeam) return

    const ownerUuid = freelanceTeam.getOwner()?.uuid
    if (memberToRemove.getUuid() === ownerUuid) {
      setMessageType('error')
      setInfoMessage('Cannot delete the creator of the team.')
      return
    }

    const updatedMembers = freelanceTeam
      .getMembers()
      .filter((member) => member.getUuid() !== memberToRemove.getUuid())

    try {
      await updateTeamMembers(
        freelanceTeam.getUuid(),
        updatedMembers.map((member) => ({
          uuid: member.getUuid(),
          fullName: member.getFullName(),
          email: member.getEmail(),
        })),
      )
      await reloadTeams()

      setMessageType('successfully')
      setInfoMessage('Member removed successfully!')
    } catch {
      setMessageType('error')
      setInfoMessage('Failed to remove member.')
    }
  }

  return (
    <>
      <div className={styles.content}>
        {!freelanceConfigOpen && (
          <Article params={{ className: styles.teams }}>
            <Article>
              <div>
                <MediumTitle
                  params={{ text: 'Freelance Team', classNames: [] }}
                />
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'config',
                    onClick: () => setFreelanceConfigOpen(!freelanceConfigOpen),
                  }}
                />
              </div>

              <div className={styles.article_content}>
                {!freelanceTeam && (
                  <div>
                    <p>{`You haven't created a freelance team.`}</p>
                    <Button
                      params={{
                        type: ButtonType.Button,
                        text: 'Create a freelance team',
                        onClick: handleFreelanceTeamCreation,
                      }}
                    />
                  </div>
                )}

                {freelanceTeam && (
                  <>
                    {(freelanceTeam.getMembers() ?? []).length > 0 ? (
                      <p>{`Press 'config' to manage your freelance team.`}</p>
                    ) : (
                      <p>{`There aren't members in your freelance team.`}</p>
                    )}
                  </>
                )}
              </div>
            </Article>

            <Article>
              <MediumTitle params={{ text: 'Company Teams', classNames: [] }} />
              <div className={styles.article_content}>
                {companyTeams.length > 0 ? (
                  <ul className={styles.company_team}>
                    {companyTeams.map((team) => (
                      <li key={team.getUuid()}>{team.getName()}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{`You don't belong to any company team.`}</p>
                )}
              </div>
            </Article>

            <Article>
              <MediumTitle
                params={{ text: 'External Teams', classNames: [] }}
              />
              <div className={styles.article_content}>
                {externalTeams.length > 0 ? (
                  <ul className={styles.external_teams}>
                    {externalTeams.map((team) => (
                      <li key={team.getUuid()}>{team.getName()}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{`You aren't in external teams.`}</p>
                )}
              </div>
            </Article>
          </Article>
        )}

        {freelanceConfigOpen && (
          <Article params={{ className: styles.freelance_config }}>
            <div>
              <Button
                params={{
                  type: ButtonType.Button,
                  text: '←',
                  onClick: () => setFreelanceConfigOpen(!freelanceConfigOpen),
                }}
              />
            </div>
            <div className={styles.freelance_config_content}>
              {freelanceTeam ? (
                <div className={styles.freelance_config_grid}>
                  <Fieldset>
                    <Input
                      params={{
                        type: 'text',
                        id: 'freelance_team_name',
                        value: title,
                        onChange: handleInputValuesChange,
                        onBlur: handleBlur,
                        placeholder: '',
                        required: false,
                        disabled: false,
                      }}
                    />
                    <Label
                      params={{
                        htmlFor: 'freelance_team_name',
                        text: 'Name',
                      }}
                    />
                  </Fieldset>
                  <Button
                    params={{
                      type: ButtonType.Button,
                      text: 'Add member',
                      onClick: handleAddMemberModalVisibility,
                    }}
                  />
                </div>
              ) : (
                <p>{`You must first create a freelance team.`}</p>
              )}
              {infoMessage && (
                <Message params={{ type: messageType, text: infoMessage }} />
              )}
              {!infoMessage && <div></div>}
              {freelanceTeam &&
              (freelanceTeam.getMembers() ?? []).length > 0 ? (
                <ul className={styles.freelance_team_members}>
                  {freelanceTeam.getMembers().map((member) => (
                    <li key={member.getUuid()}>
                      <Article>
                        <div>
                          <Button
                            params={{
                              type: ButtonType.Button,
                              text: 'X',
                              onClick: () => handleRemoveMember(member),
                            }}
                          />
                        </div>
                        <Article
                          params={{
                            className: styles.freelance_team_members_info,
                          }}
                        >
                          <SmallTitle params={{ text: member.getFullName() }} />
                          <p>{member.getEmail()}</p>
                        </Article>
                      </Article>
                    </li>
                  ))}
                </ul>
              ) : (
                freelanceTeam && (
                  <p>{`There aren't any member into your freelance team.`}</p>
                )
              )}
            </div>
          </Article>
        )}

        {selectedTeam && (
          <>
            <Article params={{ className: styles.team }}>
              <div>
                <Button params={{ type: ButtonType.Button, text: 'teams' }} />
                <div>
                  <Button
                    params={{ type: ButtonType.Button, text: 'members' }}
                  />
                  <Button params={{ type: ButtonType.Button, text: 'leave' }} />
                </div>
              </div>
            </Article>
            <div>
              <Button
                params={{
                  type: ButtonType.Button,
                  text: '+',
                  className: styles.create_btn,
                }}
              />
            </div>
          </>
        )}
      </div>
      {showAddMemberModal && (
        <Modal params={{ setShowModal: setShowAddMemberModal }}>
          <div className={styles.members_modal}>
            <Fieldset>
              <Input
                params={{
                  type: 'search',
                  id: 'search_admin',
                  value: searchQuery,
                  onChange: handleSearchMemberInputChange,
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
