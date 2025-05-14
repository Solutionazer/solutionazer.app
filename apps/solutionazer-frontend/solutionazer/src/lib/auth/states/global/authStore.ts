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

import { create, StoreApi, UseBoundStore } from 'zustand'
import AuthUser from '../../authUser'
import { persist } from 'zustand/middleware'
import Company from '../../companies/company'
import Admin from '../../companies/admins/admin'
import Member from '../../companies/members/member'

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  company: Company | null
  setCompany: (company: Company | null) => void
}

const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create<
  AuthState,
  [['zustand/persist', AuthState]]
>(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      company: null,
      setCompany: (company) => set({ company }),
    }),
    {
      name: 'authUser',
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          const plainUser = state.user as any
          state.user = new AuthUser({
            uuid: plainUser.uuid,
            fullName: plainUser.fullName,
            email: plainUser.email,
          })
        }
        if (state?.company) {
          const plainCompany = state.company as any
          state.company = new Company({
            uuid: plainCompany.uuid,
            name: plainCompany.name,
            admins: plainCompany.admins.map((admin: any) => {
              return new Admin({
                uuid: admin.uuid,
                fullName: admin.fullName,
                email: admin.email,
              })
            }),
            members: plainCompany.members.map((member: any) => {
              return new Member({
                uuid: member.uuid,
                fullName: member.fullName,
                email: member.email,
              })
            }),
          })
        }
      },
    },
  ),
)

export default useAuthStore
