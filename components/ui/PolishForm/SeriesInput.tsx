import {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import type { PolishColumnRef } from './types'
import DetailInput from '@/components/ui/DetailInput'
import { useRouter } from 'expo-router'
import { useSeriesStore } from '@/store/series'

type SeriesInputProps = {
  val: string
  onPress?: () => void
  disabled?: boolean
  brandId: string
}

const SeriesInput = forwardRef<PolishColumnRef<string>, SeriesInputProps>(
  ({ val, brandId }, ref) => {
    const router = useRouter()
    const seriesMap = useSeriesStore((state) => state.seriesMap)
    const [seriesId, setSeriesId] = useState(val)
    const seriesName = useMemo(() => {
      if (brandId === '' || seriesId === '') return ''
      const seriesList = seriesMap.get(brandId)
      if (!seriesList) return ''
      return seriesList.find((s) => s.seriesId === seriesId)?.seriesName || 'Not found'
    }, [seriesId, seriesMap, brandId])

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
