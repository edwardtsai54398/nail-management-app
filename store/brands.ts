import {create} from 'zustand'
import {Brand} from "@/types/ui";

export interface BrandStore {
    data: Brand[]
    setData: (data: Brand[]) => void
}

export const useBrandStore = create<BrandStore>((set) => ({
    data: [],
    setData: (by) => set(() => ({data: by}))
}))
