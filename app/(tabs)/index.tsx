import { Col, Flex, Row } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import PolishCard from '@/components/ui/PolishCard'
import { getPolishList } from '@/db/queries/polishItem'
import { getBrands } from '@/db/queries/brand'
import { getTags } from '@/db/queries/tags'
import { useSQLiteContext } from 'expo-sqlite'
import { FONT_SIZES, GRID_GAP, SPACING } from '@/constants/layout'
import { Polish, SectionData } from '@/types/ui'
import { useEffect, useState } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign'
import FloatingBtn from '@/components/ui/FloatingBtn'
import { useRouter } from 'expo-router'
import { useBrandStore } from '@/store/brands'
import { useSeriesStore } from '@/store/series'
import { useTagStore } from '@/store/tags'

function groupInRows<T>(data: T[], columnsPerRow: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < data.length; i += columnsPerRow) {
    result.push(data.slice(i, i + columnsPerRow))
  }
  return result
}

export default function Index() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const setBrandsState = useBrandStore((state) => state.setData)
  const setSeriesState = useSeriesStore((state) => state.setData)
  const setTagsState = useTagStore((state) => state.setData)
  const [polishSectionData, setPolishData] = useState<SectionData>([])
  const db = useSQLiteContext()
  useEffect(() => {
    getPolishList(db).then((result) => {
      // console.log(result);
      if (result.success) {
        const sectionData = result.data.series.map((s, i) => ({
          ...s,
          data: groupInRows<Polish>(result.data.polishItems[i], 3),
        }))
        setPolishData(sectionData)
        setSeriesState(result.data.series)
      }
    })
    getBrands(db).then((result) => {
      if (!result.success) return
      // console.log('All brands', result.data)
      setBrandsState(result.data)
    })
    getTags(db).then((res) => {
      if (!res.success) return
      setTagsState(res.data)
    })
  }, [])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SectionList
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
