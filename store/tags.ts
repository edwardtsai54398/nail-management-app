import { create } from 'zustand'
import { Tag } from '@/types/ui'

export interface TagStore {
  data: Tag[]
  setData: (data: Tag[]) => void
  addTag: (tag: Tag) => void
}

export const useTagStore = create<TagStore>((set) => ({
  data: [],
  setData: (data) => set(() => ({ data })),
  addTag: (tag: Tag) =>
    set((state) => {
      if (state.data.some((t) => t.tagId === tag.tagId)) {
        const newData = state.data.filter((t) => t.tagId !== tag.tagId)
        newData.push(tag)
        return { data: newData }
      }
      return {
        data: [tag, ...state.data],
      }
    }),
}))
