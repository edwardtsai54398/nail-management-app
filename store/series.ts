import { create } from 'zustand'
import { Series } from '@/types/ui'

interface SeriesStore {
  seriesMap: Map<string, Series>
  setAllData: (data: Series[]) => void
  set: (data: Series) => void
}

export const useSeriesStore = create<SeriesStore>((set) => ({
  seriesMap: new Map(),
  setAllData: (data) =>
    set(() => {
      return {
        seriesMap: new Map(data.map((s) => [s.seriesId, s])),
      }
    }),
  set: (series) =>
    set((state) => {
      const map = new Map(state.seriesMap)
      map.set(series.seriesId, series)
      return { seriesMap: map }
    }),
}))
