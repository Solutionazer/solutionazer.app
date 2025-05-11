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

import useAuthStore from '@/lib/auth/states/global/authStore'
import styles from './page.module.css'
import {
  createFreelanceTeam,
  getTeamsByUser,
} from '@/lib/utils/users-management/teamsHandler'
import { useEffect, useState } from 'react'
import Button from '@/components/shared/form/components/Button'
import ButtonType from '@/lib/auth/forms/enums/buttonType'
import Article from '@/components/shared/containers/Article'
import Team from '@/lib/teams/team'
import MediumTitle from '@/components/shared/titles/MediumTitle'
import TeamMember from '@/lib/teams/members/team-member'

export default function Route() {
  // auth global state
  const { user } = useAuthStore()

  // teams state
  const [teams, setTeams] = useState<Team[]>([])

  // selected team state
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  // freelance config state
  const [freelanceConfigOpen, setFreelanceConfigOpen] = useState<boolean>(false)

  // load teams
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userUuid: string = user.getUuid() ?? ''

        const fetchedTeams: Team[] = (await getTeamsByUser(userUuid)).map(
          (team: {
            uuid: string
            name: string
            type: string
            members: TeamMember[]
          }) => {
            return new Team({
              uuid: team.uuid,
              name: team.name,
              type: team.type,
              members: team.members,
            })
          },
        )

        setTeams(fetchedTeams)
      }
    }

    fetchData()
  }, [user])

  // team types
  const freelanceTeam = teams.find((team) => team.getType() === 'freelance-own')
  const companyTeams = teams.filter((team) => team.getType() === 'company-own')
  const externalTeams = teams.filter((team) => team.getType() === 'external')

  // 'onClick' | freelance team creation
  const handleFreelanceTeamCreation = async () => {
    try {
      const owner: string = user?.getUuid() ?? ''
      const name: string = `${user?.getFullName()?.split(' ')[0]}'s Team`

      const newTeamData = await createFreelanceTeam(name, owner)

      const newTeam: Team = new Team({
        uuid: newTeamData.uuid,
        name: newTeamData.name,
        type: newTeamData.type,
        members: newTeamData.members,
      })

      setTeams((prevTeams) => [...prevTeams, newTeam])
    } catch {}
  }

  return (
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
                  {freelanceTeam.getMembers().length > 0 ? (
                    <ul>
                      {freelanceTeam.getMembers().map((member) => (
                        <li key={member.getUuid()}>{member.getFullName()}</li>
                      ))}
                    </ul>
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
                <ul>
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
            <MediumTitle params={{ text: 'External Teams', classNames: [] }} />
            <div className={styles.article_content}>
              {externalTeams.length > 0 ? (
                <ul>
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
              ''
            ) : (
              <p>{`You must first create a freelance team.`}</p>
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
                <Button params={{ type: ButtonType.Button, text: 'members' }} />
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
  )
}
