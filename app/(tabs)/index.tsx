import { Col, Flex, Row } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import BottomFilters from '@/components/ui/BottomFilters'
import FloatingBtn from '@/components/ui/FloatingBtn'
import PolishCard from '@/components/ui/PolishCard'
import { FilterOption, TopFiltersRef } from '@/components/ui/TopFilters'
import { FONT_SIZES, GRID_GAP, SPACING } from '@/constants/layout'
import { getBrands } from '@/db/queries/brand'
import { getPolishList, PolishListFilterQuery } from '@/db/queries/polishItem'
import { getAllPolishTypes } from '@/db/queries/polishTypes'
import { useBrandStore } from '@/store/brands'
import { usePolishTypesStore } from '@/store/polishTypes'
import { Brand, Polish, PolishType, SectionData } from '@/types/ui'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useFocusEffect, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useMemo, useRef, useState } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function groupInRows<T>(data: T[], columnsPerRow: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < data.length; i += columnsPerRow) {
    result.push(data.slice(i, i + columnsPerRow))
  }
  return result
}

const TopFilterOptions: FilterOption[] = [
  {
    label: '品牌',
    name: 'brandId',
  },
  {
    label: '色膠種類',
    name: 'polishType',
  },
  {
    label: '顏色',
    name: 'color',
  },
  {
    label: '更多',
    name: 'more',
  },
]

export default function Index() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const db = useSQLiteContext()
  const brands = useBrandStore((state) => state.data)
  const setBrands = useBrandStore((state) => state.setData)
  const polishTypes = usePolishTypesStore((state) => state.data)
  const setPolishTypes = usePolishTypesStore((state) => state.setData)
  const [polishSectionData, setPolishData] = useState<SectionData>([])
  const [brandSelected, setBrandSelected] = useState<Brand | null>(null)
  const [polishTypeSelected, setPolishTypeSelected] = useState<PolishType | null>(null)
  const optionsSelected = useMemo(() => {
    let selected: string[] = []
    if (brandSelected) {
      selected.push('brandId')
    }
    if (polishTypeSelected) {
      selected.push('polishType')
    }
    return selected
  }, [brandSelected, polishTypeSelected])
  const topFiltersRef = useRef<TopFiltersRef>(null)

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect')
      const payload: PolishListFilterQuery = {
        // brandId: '01',
        // colorIds: ['PINK', 'PURPLE'],
        polishType: { typeId: 'GLITTER_GEL', isOfficial: true },
      }

      getPolishList(db, payload).then((result) => {
        // console.log(result);
        if (result.success) {
          const sectionData = result.data.series.map((s, i) => ({
            ...s,
            data: groupInRows<Polish>(result.data.polishItems[i], 3),
          }))
          setPolishData(sectionData)
        }
      })
      getBrands(db).then((res) => {
        if (!res.success) return
        setBrands(res.data)
      })
      getAllPolishTypes(db).then((res) => {
        if (!res.success) return
        setPolishTypes(res.data)
      })
    }, [db]),
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Flex justify="end" style={{ height: 60, width: '100%' }}>
        {/*<TopFilters ref={topFiltersRef} options={TopFilterOptions} optionsSelected={optionsSelected}>*/}
        {/*  <TopFilterOption name={'brandId'}>*/}
        {/*      <SelectList*/}
        {/*        data={brands}*/}
        {/*        renderItem={(item) => item.brandName}*/}
        {/*        onItemPress={(item) => {setBrandSelected(item)}}*/}
        {/*        isSelected={(item) => item.brandId === brandSelected?.brandId}*/}
        {/*      />*/}
        {/*  </TopFilterOption>*/}
        {/*  <TopFilterOption name={'polishType'} drawerHeight={400}>*/}

        {/*      <SelectList*/}
        {/*        data={polishTypes}*/}
        {/*        renderItem={(item) => item.name}*/}
        {/*        onItemPress={(item) => {setPolishTypeSelected(item)}}*/}
        {/*        isSelected={(item) => item.typeId === polishTypeSelected?.typeId}*/}
        {/*      />*/}
        {/*  </TopFilterOption>*/}
        {/*</TopFilters>*/}
        <BottomFilters />
      </Flex>
      <SectionList
        // pointerEvents={'none'}
        sections={polishSectionData}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Flex justify="between">
              <ThemeText type="subtitle">{section.brandName}</ThemeText>
              <ThemeText color="second">{section.seriesName}</ThemeText>
            </Flex>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Row>
              {item.map((col) => (
                <Col key={col.polishId} base={4}>
                  <PolishCard data={col}></PolishCard>
                </Col>
              ))}
            </Row>
          </View>
        )}
        style={{ marginBottom: SPACING.lg }}></SectionList>
      <FloatingBtn
        onPress={() => {
          router.navigate('/add-polish')
        }}>
        <AntDesign name="plus" size={FONT_SIZES.xl} />
      </FloatingBtn>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    height: '100%',
  },
  row: {
    width: '100%',
    marginTop: GRID_GAP,
  },
  sectionHeader: {
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgb(242, 242, 242)',
  },
})
