import { create, StoreApi, UseBoundStore } from 'zustand'

interface ModuleState {
  module: string | null
  setModule: (module: string | null) => void
}

export const useModuleStore: UseBoundStore<StoreApi<ModuleState>> =
  create<ModuleState>((set) => ({
    module: null,
    setModule: (module) => set({ module }),
  }))
