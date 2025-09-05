import {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useRouter } from 'expo-router'
import type { PolishColumnRef } from './types'
import DetailInput from '@/components/ui/DetailInput'
import { useBrandStore } from '@/store/brands'
import { getBrands } from '@/db/queries/brand'
import { useSQLiteContext } from 'expo-sqlite'

type BrandInputProps = {
  val: string
  onChange?: (value: string) => void
}

const BrandInput = forwardRef<PolishColumnRef<string>, BrandInputProps>(
  ({ val, onChange }, ref) => {
    const router = useRouter()
    const db = useSQLiteContext()
    const [brandId, setBrandId] = useState(val)
    const brandsData = useBrandStore((state) => state.data)
    const setBrandsData = useBrandStore((state) => state.setData)
    const brandName = useMemo(() => {
      return brandsData.find((b) => b.brandId === brandId)?.brandName || ''
    }, [brandId, brandsData])

    useEffect(() => {
      if (brandsData.length || brandId === '') return
      console.log('fetch brands')
      getBrands(db).then((response) => {
        if (!response.success) return
        setBrandsData(response.data)
      })
    }, [brandsData, setBrandsData, db, brandId])

    const handlePress = useCallback(() => {
      if (brandId === '') {
        router.navigate('/brand-select')
      } else {
        router.navigate({ pathname: '/brand-select', params: { brandId } })
      }
    }, [router, brandId])

    useImperativeHandle(ref, () => ({
      getValue: () => brandId,
      setValue: (val) => {
        // console.log('BrandInput did setValue', val)
        if (onChange) onChange(val)
        setBrandId(val)
      },
    }))
    return (
      <DetailInput
        label="品牌"
        type="select"
        border="bottom"
        value={brandName}
        onSelectPress={handlePress}
      />
    )
  },
)

BrandInput.displayName = 'BrandInput'

export default memo(BrandInput)
