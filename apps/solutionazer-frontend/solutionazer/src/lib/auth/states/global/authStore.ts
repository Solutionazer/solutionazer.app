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

import { create, StoreApi, UseBoundStore } from 'zustand'
import AuthUser from '../../authUser'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
}

const useAuthStore: UseBoundStore<StoreApi<AuthState>> = create<
  AuthState,
  [['zustand/persist', AuthState]]
>(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
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
      },
    },
  ),
)

export default useAuthStore
