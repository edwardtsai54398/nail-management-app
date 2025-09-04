import { create } from 'zustand'
import { Series } from '@/types/ui'

interface SeriesStore {
  seriesMap: Map<string, Series[]>
  setData: (data: Series[]) => void
  addData: (brandId: string, data: Series[]) => void
}

export const useSeriesStore = create<SeriesStore>((set) => ({
  seriesMap: new Map([]),
  setData: (val) =>
    set(() => {
      const map = new Map<string, Series[]>()
      val.forEach((s) => {
        if (!map.has(s.brandId)) {
          map.set(s.brandId, [s])
        } else {
          const prev = map.get(s.brandId)!
          map.set(s.brandId, [...prev, s])
        }
      })
      return { seriesMap: map }
    }),
  addData: (brandId, data) =>
    set((state) => {
      const map = new Map(state.seriesMap)
      if (map.has(brandId)) {
        const prev = map.get(brandId)!
        map.set(brandId, data.concat(prev))
      } else {
        map.set(brandId, data)
      }
      return { seriesMap: map }
    }),
}))
