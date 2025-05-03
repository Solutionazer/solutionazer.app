import { create, StoreApi, UseBoundStore } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModuleState {
  module: string | null
  setModule: (module: string | null) => void
}

export const useModuleStore: UseBoundStore<StoreApi<ModuleState>> = create<
  ModuleState,
  [['zustand/persist', ModuleState]]
>(
  persist<ModuleState>(
    (set) => ({
      module: null,
      setModule: (module) => set({ module }),
    }),
    {
      name: 'module',
    },
  ),
)
