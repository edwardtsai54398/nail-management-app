import DetailInput from '@/components/ui/DetailInput'
import { getSeries } from '@/db/queries/series'
import { useSeriesStore } from '@/store/series'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import type { PolishColumnRef } from './types'

type SeriesInputProps = {
  val: string
  onPress?: () => void
  disabled?: boolean
  brandId: string
}

const SeriesInput = forwardRef<PolishColumnRef<string>, SeriesInputProps>(
  ({ val, brandId }, ref) => {
    const router = useRouter()
    const db = useSQLiteContext()
    const seriesMap = useSeriesStore((state) => state.seriesMap)
    const setSeriesMap = useSeriesStore((state) => state.setAllData)
    const [seriesId, setSeriesId] = useState(val)
    const seriesName = useMemo(() => {
      if (seriesId === '') return ''
      const series = seriesMap.get(seriesId)
      if (!series) return ''
      return series.seriesName
    }, [seriesId, seriesMap])

    const handlePress = useCallback(() => {
      if (brandId === '') {
        console.log('Please select a brand')
        return
      } else if (seriesId === '') {
        router.navigate({ pathname: '/series-select', params: { brandId } })
      } else {
        router.navigate({ pathname: '/series-select', params: { brandId, seriesId } })
      }
    }, [brandId, router, seriesId])

    useEffect(() => {
      //重置
      // console.log('SeriesInput 重置')
      if (brandId) setSeriesId('')
    }, [brandId])

    useEffect(() => {
      if (seriesMap.size) return
      getSeries(db).then((response) => {
        if (!response.success) return
        setSeriesMap(response.data)
      })
    }, [db, setSeriesMap, seriesMap])

    useImperativeHandle(ref, () => ({
      getValue: () => seriesId,
      setValue: (val) => {
        setSeriesId(val)
      },
    }))
    return (
      <DetailInput
        label="系列"
        type="select"
        border="bottom"
        value={seriesName}
        onSelectPress={handlePress}
      />
    )
  },
)

SeriesInput.displayName = 'SeriesInput'

export default memo(SeriesInput)
