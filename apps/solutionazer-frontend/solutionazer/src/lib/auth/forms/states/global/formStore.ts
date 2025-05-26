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
import FormData from '../../formData'
import { persist } from 'zustand/middleware'

interface FormState {
  formData: FormData
  setFormData: (data: FormData) => void
  resetFormData: () => void
}

const useFormStore: UseBoundStore<StoreApi<FormState>> = create<
  FormState,
  [['zustand/persist', FormState]]
>(
  persist<FormState>(
    (set) => ({
      formData: new FormData({ email: '', userType: '' }),
      setFormData: (data: FormData) => set({ formData: data }),
      resetFormData: () =>
        set({
          formData: new FormData({
            email: '',
            userType: '',
            password: undefined,
            passwordToConfirm: undefined,
            fullName: undefined,
            companyName: undefined,
          }),
        }),
    }),
    {
      name: 'formData',
      onRehydrateStorage: () => (state) => {
        if (state?.formData) {
          const plainData = state.formData as any
          state.formData = new FormData({
            email: plainData.email,
            userType: plainData.userType,
            password: plainData.password,
            passwordToConfirm: plainData.passwordToConfirm,
            fullName: plainData.fullName,
            companyName: plainData.companyName,
          })
        }
      },
    },
  ),
)

export default useFormStore
