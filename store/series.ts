import {create} from 'zustand'
import { Series } from "@/types/ui";

interface SeriesStore {
    seriesMap: Map<string, Series[]>
    setData: (data: Series[]) => void
}

export const useSeriesStore = create<SeriesStore>((set) => ({
    seriesMap: new Map([]),
    setData: (val) => set(() => {
        const map = new Map<string, Series[]>()
        val.forEach(s => {
            if(!map.has(s.brandId)){
                map.set(s.brandId, [s])
            } else {
                const prev = map.get(s.brandId)!
                map.set(s.brandId, [...prev, s])
            }
        })
        return {seriesMap: map}
    })
}))