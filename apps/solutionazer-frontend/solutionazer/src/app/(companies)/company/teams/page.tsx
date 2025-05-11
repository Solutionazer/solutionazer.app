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
import { getTeamsByCompany } from '@/lib/utils/users-management/teamsHandler'
import TeamMember from '@/lib/teams/members/team-member'
import { searchUsersInCompany } from '@/lib/utils/users-management/usersHandler'

export default function Teams() {
  // auth global state
  const { company } = useAuthStore()

  // team state
  const [teams, setTeams] = useState<Team[]>([])

  // load teams
  useEffect(() => {
    const fetchData = async () => {
      if (company) {
        const companyUuid: string = company.getUuid()

        const fetchedTeams: Team[] = (await getTeamsByCompany(companyUuid)).map(
          (team: { uuid: string; name: string; members: TeamMember[] }) => {
            return new Team({
              uuid: team.uuid,
              name: team.name,
              members: team.members,
            })
          },
        )

        setTeams(fetchedTeams)
      }
    }

    fetchData()
  }, [company])

  // UI states
  const [infoMessage, setInfoMessage] = useState<string | null>(null) // messages

  // messages
  const teamCreated: string = 'Team created successfully.'
  const teamCreationFailed: string = 'Failed to create team.'

  // modal state
  const [showModal, setShowModal] = useState<boolean>(false)

  // 'onClick' | modal
  const handleModalVisibility = () => {
    setShowModal(true)
  }

  // search member states
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
        const companyUuid: string = company?.getUuid() ?? ''

        const foundUsers = await searchUsersInCompany(companyUuid, searchQuery)

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
      } catch {}
    }

    search()
  }, [company, searchQuery])

  // 'onChange' | search members input
  const handleSearchAdminInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setSearchQuery(event.target.value)
  }

  // 'onClick' | button '+' modal search results
  const handleAddingMembers = async () => {}

  return (
    <>
      <div className={styles.content}>
        {infoMessage && <Message params={{ type: '', text: infoMessage }} />}
        {teams && teams.length > 0 ? (
          <ul>
            {teams.map((team) => (
              <li key={team.getUuid()}></li>
            ))}
          </ul>
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
                        onClick: () => handleAddingMembers(),
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
