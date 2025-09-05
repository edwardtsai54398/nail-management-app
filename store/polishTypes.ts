import { create } from 'zustand'
import { PolishType } from '@/types/ui'

export interface PolishTypesStore {
  data: PolishType[]
  setData: (data: PolishType[]) => void
}

export const usePolishTypesStore = create<PolishTypesStore>((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
}))
