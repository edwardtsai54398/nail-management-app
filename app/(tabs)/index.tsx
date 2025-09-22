import { Col, Flex, Row } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import FloatingBtn from '@/components/ui/FloatingBtn'
import PolishCard from '@/components/ui/PolishCard'
import TopFilters from '@/components/ui/TopFilters'
import { FONT_SIZES, GRID_GAP, SPACING } from '@/constants/layout'
import { getPolishList } from '@/db/queries/polishItem'
import { Polish, SectionData } from '@/types/ui'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useFocusEffect, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'
import { SectionList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const [polishSectionData, setPolishData] = useState<SectionData>([])
  const db = useSQLiteContext()
  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect')

      getPolishList(db).then((result) => {
        // console.log(result);
        if (result.success) {
          const sectionData = result.data.series.map((s, i) => ({
            ...s,
            data: groupInRows<Polish>(result.data.polishItems[i], 3),
          }))
          setPolishData(sectionData)
        }
      })
    }, [db]),
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Flex justify="end" style={{height: 60, width: '100%'}}>
        <TopFilters></TopFilters>
      </Flex>
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
