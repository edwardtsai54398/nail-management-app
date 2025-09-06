import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { SPACING } from '@/constants/layout'
import { LINE_COLORS } from '@/constants/Colors'
import BrandInput from './BrandInput'
import type { PolishColumnRef, PolishFormValues, PolishFormRef } from './types'
import SeriesInput from './SeriesInput'
import ColorNameInput from './ColorNameInput'
import PolishTypesSelector from './PolishTypesSelector'
import { PolishType } from '@/types/ui'
import ColorSelector from './ColorSelector'
import { Row, Col } from '@/components/layout/Flex'
import StockCounter from './StockCounter'
import Favorites from './Favorite'
import TagsDisplay from './TagsDisplay'
import NoteInput from './NoteInput'
import ImagesPicker from './ImagesPicker'


type PolishFormProps = {
  initValues: PolishFormValues
}

const PolishForm = forwardRef<PolishFormRef, PolishFormProps>(({ initValues }, ref) => {
  const initValRef = useRef(initValues)
  const brandIdRef = useRef('')
  const brandRef = useRef<PolishColumnRef<string>>(null)
  const seriesRef = useRef<PolishColumnRef<string>>(null)
  const coloNameRef = useRef<PolishColumnRef<string>>(null)
  const polishTypesRef = useRef<PolishColumnRef<PolishType | null>>(null)
  const colorSelectorRef = useRef<PolishColumnRef<string[]>>(null)
  const stockRef = useRef<PolishColumnRef<number>>(null)
  const favoritesRef = useRef<PolishColumnRef<boolean>>(null)
  const tagsRef = useRef<PolishColumnRef<PolishFormValues['tagIds']>>(null)
  const noteRef = useRef<PolishColumnRef<string>>(null)

  const handleBrandInputChange = useCallback(
    (brandId: string) => {
      // console.log('BrandInput Change', brandId)
      brandIdRef.current = brandId
    },
    [brandIdRef],
  )

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      brandId: brandRef.current?.getValue() || '',
      seriesId: seriesRef.current?.getValue() || '',
      colorName: coloNameRef.current?.getValue() || '',
      polishType: polishTypesRef.current?.getValue() || null,
      colorIds: colorSelectorRef.current?.getValue() || [],
      stock: stockRef.current?.getValue() || 0,
      isFavorites: favoritesRef.current?.getValue() || false,
      tagIds: tagsRef.current?.getValue() || [],
      note: noteRef.current?.getValue() || ''
    }),
    setValue: (key, val) => {
      switch (key) {
        case 'brandId':
          brandRef.current?.setValue(val as string)
          break
        case 'seriesId':
          seriesRef.current?.setValue(val as string)
          break
        case 'colorName':
          coloNameRef.current?.setValue(val as string)
          break
        case 'polishType':
          polishTypesRef.current?.setValue(val as PolishType)
          break
        case 'tagIds':
          tagsRef.current?.setValue(val as string[])
          break
      }
    },
  }))

  return (
    <>
    <ImagesPicker/>
    <View style={styles.card}>
      <BrandInput
        ref={brandRef}
        val={initValRef.current.brandId}
        onChange={handleBrandInputChange}
        />
      <SeriesInput ref={seriesRef} val={initValRef.current.seriesId} brandId={brandIdRef.current} />
      <ColorNameInput ref={coloNameRef} val={initValRef.current.colorName} />
      <PolishTypesSelector ref={polishTypesRef} val={initValRef.current.polishType} />
      <ColorSelector ref={colorSelectorRef} values={initValRef.current.colorIds} />
      <View style={styles.stockFavoriteWrapper}>
        <Row>
          <Col base={7} style={styles.stockWrapper}>
            <StockCounter ref={stockRef} val={initValRef.current.stock} />
          </Col>
          <Col base={5}>
            <Favorites ref={favoritesRef} val={initValRef.current.isFavorites} />
          </Col>
        </Row>
      </View>
      <TagsDisplay ref={tagsRef} values={initValRef.current.tagIds} />
      <NoteInput ref={noteRef} val={initValRef.current.note}/>
      
    </View>
        </>
  )
})

const styles = StyleSheet.create({
  card: {
    borderRadius: SPACING.lg,
    borderColor: LINE_COLORS.second,
    paddingHorizontal: SPACING.md,
    paddingTop: 0,
    paddingBottom: SPACING.md,
    backgroundColor: 'white',
  },
  stockFavoriteWrapper: {
    borderBottomWidth: 1,
    borderColor: LINE_COLORS.second,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  stockWrapper: {
    borderRightWidth: 1,
    borderColor: LINE_COLORS.second,
  },
})

PolishForm.displayName = 'PolishForm'
export default PolishForm
