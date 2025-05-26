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

import Modal from '@/components/shared/containers/modal/Modal'
import Button from '@/components/shared/form/components/Button'
import Fieldset from '@/components/shared/form/components/containers/fieldset/Fieldset'
import Input from '@/components/shared/form/components/Input'
import Label from '@/components/shared/form/components/Label'
import Message from '@/components/shared/messages/Message'
import SmallTitle from '@/components/shared/titles/SmallTitle'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import { useEffect, useState } from 'react'

import styles from './page.module.css'
import useAuthStore from '@/lib/auth/states/global/authStore'
import Team from '@/lib/teams/team'
import {
  createCompanyTeam,
  deleteTeam,
  getTeamsByCompany,
  updateTeamMembers,
  updateTeamTitle,
} from '@/lib/utils/users-management/teamsHandler'
import TeamMember from '@/lib/teams/members/team-member'
import { searchUsersInCompany } from '@/lib/utils/users-management/usersHandler'
import Article from '@/components/shared/containers/Article'

type ModalStep = 'start' | 'naming' | 'adding-members'

export default function Teams() {
  // auth global state
  const { company } = useAuthStore()

  // teams state
  const [teams, setTeams] = useState<Team[]>([])

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // message type state
  const [messageType, setMessageType] = useState<string>('error')

  // modal step state
  const [modalStep, setModalStep] = useState<ModalStep>('start')

  // team name state
  const [teamName, setTeamName] = useState('')

  // selected team members state
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([])

  // show modal state
  const [showModal, setShowModal] = useState<boolean>(false)

  // search states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<TeamMember[]>([])

  // load teams
  useEffect(() => {
    const fetchData = async () => {
      if (!company) return
      const companyUuid: string = company.getUuid()

      const fetchedTeams: Team[] = (await getTeamsByCompany(companyUuid)).map(
        (team: { uuid: string; name: string; members: TeamMember[] }) =>
          new Team({
            uuid: team.uuid,
            name: team.name,
            members: team.members.map((member: any) => {
              return new TeamMember({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            }),
          }),
      )

      setTeams(fetchedTeams)
    }

    fetchData()
  }, [company])

  // handle initial "Create" button click
  const handleModalVisibility = () => {
    const baseName = `${company?.getName()}'s Team`
    const defaultName = `${baseName} ${teams.length + 1}`
    setTeamName(defaultName)
    setShowModal(true)
    setModalStep('naming')
  }

  // step 2: Add members
  const handleContinue = () => {
    setModalStep('adding-members')
  }

  // search handler
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 3 || !company) {
        setSearchResults([])
        return
      }

      const companyUuid = company.getUuid()
      const users = await searchUsersInCompany(companyUuid, searchQuery)

      const members = users.map(
        (user: { uuid: string; fullName: string; email: string }) =>
          new TeamMember({
            uuid: user.uuid,
            fullName: user.fullName,
            email: user.email,
          }),
      )

      setSearchResults(members)
    }

    search()
  }, [searchQuery, company])

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setSearchQuery(e.target.value)
  }

  // add member to selected list
  const handleAddMember = (member: TeamMember) => {
    if (selectedMembers.some((m) => m.getUuid() === member.getUuid())) return
    setSelectedMembers([...selectedMembers, member])
  }

  // final: team creation
  const handleFinish = async () => {
    if (!company) return

    try {
      const companyUuid = company.getUuid()

      const newTeamData = await createCompanyTeam(
        teamName,
        companyUuid,
        selectedMembers.map((member) => ({
          uuid: member.getUuid(),
          fullName: member.getFullName(),
          email: member.getEmail(),
        })),
      )

      const newTeam = new Team({
        uuid: newTeamData.uuid,
        name: newTeamData.name,
        members: newTeamData.members.map(
          (member: { uuid: string; fullName: string; email: string }) => {
            return new TeamMember({
              uuid: member.uuid,
              fullName: member.fullName,
              email: member.email,
            })
          },
        ),
      })

      setTeams((prev) => [...prev, newTeam])
      setMessageType('successfully')
      setInfoMessage('Team created successfully.')
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage('Failed to create team.')
    }

    setShowModal(false)
    setTeamName('')
    setSearchQuery('')
    setSearchResults([])
    setSelectedMembers([])
    setModalStep('start')
  }

  // editing team state
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [editedTeamName, setEditedTeamName] = useState<string>('')
  const [editMode, setEditMode] = useState<boolean>(false)
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false)

  // handle team deletion
  const handleTeamDeletion = async (teamUuid: string) => {
    try {
      await deleteTeam(teamUuid)
      setTeams((prevTeams) => prevTeams.filter((t) => t.getUuid() !== teamUuid))
      setMessageType('successfully')
      setInfoMessage('Team deleted successfully.')
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage('Failed to delete team.')
    }
  }

  // handle team edition
  const handleTeamEdition = (team: Team) => {
    setEditingTeam(team)
    setEditedTeamName(team.getName())
    setEditMode(true)
  }

  const handleCancelEdit = () => {
    setEditingTeam(null)
    setEditedTeamName('')
    setEditMode(false)
  }

  // show edit modal
  const handleEditModalVisibility = () => {
    setEditModalVisible(true)
  }

  // add member in edition mode
  const handleAddMemberToEdit = async (member: TeamMember) => {
    if (!editingTeam || !company) return

    const updatedMembers = [...editingTeam.getMembers(), member]

    try {
      await updateTeamMembers(
        editingTeam.getUuid(),
        updatedMembers.map((member) => ({
          uuid: member.getUuid(),
          fullName: member.getFullName(),
          email: member.getEmail(),
        })),
      )

      const updatedTeam = new Team({
        uuid: editingTeam.getUuid(),
        name: editingTeam.getName(),
        members: updatedMembers,
      })

      setEditingTeam(updatedTeam)
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage('Failed to add member')
    }
  }

  // remove member
  const handleMembersDeletion = async (member: TeamMember) => {
    if (!editingTeam || !company) return

    const updatedMembers = editingTeam
      .getMembers()
      .filter((m) => m.getUuid() !== member.getUuid())

    try {
      await updateTeamMembers(
        editingTeam.getUuid(),
        updatedMembers.map((member) => ({
          uuid: member.getUuid(),
          fullName: member.getFullName(),
          email: member.getEmail(),
        })),
      )

      const updatedTeam = new Team({
        uuid: editingTeam.getUuid(),
        name: editingTeam.getName(),
        members: updatedMembers,
      })

      setEditingTeam(updatedTeam)
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage('Failed to remove member')
    }
  }

  // handle team name blur
  const handleTeamNameBlur = async () => {
    if (!editingTeam || editedTeamName === editingTeam.getName()) return

    try {
      await updateTeamTitle(editingTeam.getUuid(), editedTeamName)

      const updatedTeam = new Team({
        uuid: editingTeam.getUuid(),
        name: editingTeam.getName(),
        members: editingTeam.getMembers(),
      })

      setEditingTeam(updatedTeam)
      setMessageType('successfully')
      setInfoMessage('Team name updated successfully.')
    } catch (error) {
      console.error(error)

      setMessageType('error')
      setInfoMessage('Failed to update team name.')
    }
  }

  return (
    <>
      <div className={styles.content}>
        {infoMessage && (
          <Message params={{ type: messageType, text: infoMessage }} />
        )}
        {!infoMessage && <div></div>}
        {teams.length > 0 ? (
          !editMode ? (
            <ul>
              {teams.map((team) => (
                <li key={team.getUuid()} className={styles.team_item}>
                  <Article>
                    <div>
                      <Button
                        params={{
                          type: ButtonType.Button,
                          text: 'X',
                          onClick: () => handleTeamDeletion(team.getUuid()),
                        }}
                      />
                    </div>
                    <Article>
                      <p>{team.getName()}</p>
                      <Button
                        params={{
                          type: ButtonType.Button,
                          text: 'Edit',
                          onClick: () => handleTeamEdition(team),
                        }}
                      />
                    </Article>
                  </Article>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.edit_view}>
              <div>
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: '←',
                    onClick: handleCancelEdit,
                  }}
                />
              </div>
              <Fieldset>
                <Input
                  params={{
                    type: 'text',
                    id: 'edit_team_name',
                    value: editedTeamName,
                    onChange: (e) => setEditedTeamName(e.target.value),
                    onBlur: handleTeamNameBlur,
                    placeholder: ' ',
                    required: true,
                    disabled: false,
                  }}
                />
                <Label
                  params={{ htmlFor: 'edit_team_name', text: 'Team Name' }}
                />
              </Fieldset>
              <div className={styles.members}>
                <SmallTitle params={{ text: 'Members' }} />
                <ul>
                  {editingTeam?.getMembers()?.map((member) => (
                    <li key={member.getUuid()} className={styles.member_item}>
                      <Article>
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
                <div className={styles.add_members_container}>
                  <Button
                    params={{
                      type: ButtonType.Button,
                      text: 'Add Members',
                      onClick: handleEditModalVisibility,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        ) : (
          <p>No teams found.</p>
        )}
        <Button
          params={{
            type: ButtonType.Button,
            text: 'Create',
            onClick: handleModalVisibility,
          }}
        />
      </div>

      {showModal && (
        <Modal params={{ setShowModal }}>
          <div className={styles.members_modal}>
            {modalStep === 'naming' && (
              <>
                <Fieldset>
                  <Input
                    params={{
                      type: 'text',
                      id: 'team_name',
                      value: teamName,
                      onChange: (e) => setTeamName(e.target.value),
                      placeholder: ' ',
                      required: true,
                      disabled: false,
                    }}
                  />
                  <Label params={{ htmlFor: 'team_name', text: 'Team Name' }} />
                </Fieldset>
                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'Continue to add members',
                    onClick: handleContinue,
                  }}
                />
              </>
            )}

            {modalStep === 'adding-members' && (
              <>
                <Fieldset>
                  <Input
                    params={{
                      type: 'search',
                      id: 'search_member',
                      value: searchQuery,
                      onChange: handleSearchChange,
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
                            onClick: () => handleAddMember(member),
                          }}
                        />
                      </li>
                    ))
                  )}
                </ul>

                <h4>Selected Members</h4>
                <ul>
                  {selectedMembers.map((member) => (
                    <li key={member.getUuid()}>
                      {member.getFullName()} ({member.getEmail()})
                    </li>
                  ))}
                </ul>

                <Button
                  params={{
                    type: ButtonType.Button,
                    text: 'Finish',
                    onClick: handleFinish,
                  }}
                />
              </>
            )}
          </div>
        </Modal>
      )}

      {editModalVisible && (
        <Modal params={{ setShowModal: setEditModalVisible }}>
          <div className={styles.members_modal}>
            <Fieldset>
              <Input
                params={{
                  type: 'search',
                  id: 'search_member_edit',
                  value: searchQuery,
                  onChange: handleSearchChange,
                  placeholder: ' ',
                  required: false,
                  disabled: false,
                }}
              />
              <Label
                params={{
                  htmlFor: 'search_member_edit',
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
                        onClick: () => handleAddMemberToEdit(member),
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
