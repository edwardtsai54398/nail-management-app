import { Col, Flex, Row } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import BottomFilters, { BottomFilterOption, BottomFilterRef } from '@/components/ui/BottomFilters'
import FloatingBtn from '@/components/ui/FloatingBtn'
import PolishCard from '@/components/ui/PolishCard'
import SelectList from '@/components/ui/SelectList'
import { LINE_COLORS } from '@/constants/Colors'
import { FONT_SIZES, GRID_GAP, SPACING } from '@/constants/layout'
import { getBrands } from '@/db/queries/brand'
import { getOfficialColors } from '@/db/queries/colors'
import { getPolishList, PolishListFilterQuery } from '@/db/queries/polishItem'
import { getAllPolishTypes } from '@/db/queries/polishTypes'
import { useBrandStore } from '@/store/brands'
import { usePolishTypesStore } from '@/store/polishTypes'
import { Brand, Color, Polish, PolishType, SectionData } from '@/types/ui'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useFocusEffect, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ButtonsProps = {
  onApply?: () => void
  onClear?: () => void
}

const FilterApplyButtons = ({ onApply, onClear }: ButtonsProps) => {
  return (
    <Flex style={[btnStyles.container]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onClear}
        style={[btnStyles.btn, btnStyles.clear]}>
        <ThemeText>清除</ThemeText>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} onPress={onApply} style={[btnStyles.btn]}>
        <ThemeText color="primary">套用</ThemeText>
      </TouchableOpacity>
    </Flex>
  )
}

const btnStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: LINE_COLORS.default,
  },
  btn: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  clear: {
    borderColor: LINE_COLORS.default,
    borderRightWidth: 1,
  },
})

type FiltersRef = {
  open: () => void
  close: () => void
  // getParams: () => PolishListFilterQuery
}
type FiltersProps = {
  onApply?: (filters: PolishListFilterQuery) => void
}

const IndexFilters = forwardRef<FiltersRef, FiltersProps>(({ onApply }, ref) => {
  const db = useSQLiteContext()
  const bottomFilterRef = useRef<BottomFilterRef>(null)

  const brands = useBrandStore((state) => state.data)
  const setBrands = useBrandStore((state) => state.setData)
  const polishTypes = usePolishTypesStore((state) => state.data)
  const setPolishTypes = usePolishTypesStore((state) => state.setData)
  const [colorTypes, setColorTypes] = useState<Color[]>([])
  const [brandSelected, setBrandSelected] = useState<Brand | null>(null)
  const [polishTypeSelected, setPolishTypeSelected] = useState<PolishType | null>(null)
  const [colorSelected, setColorSelected] = useState<Color[]>([])
  const brandApplyed = useRef<Brand | null>(null)
  const polishTypeApplyed = useRef<PolishType | null>(null)
  const colorApplyed = useRef<Color[]>([])

  useEffect(() => {
    getBrands(db).then((res) => {
      if (!res.success) return
      setBrands(res.data)
    })
    getAllPolishTypes(db).then((res) => {
      if (!res.success) return
      setPolishTypes(res.data)
    })
    getOfficialColors(db).then((response) => {
      if (!response.success) return
      setColorTypes(response.data)
    })
  }, [db, setBrands, setPolishTypes])

  const handleDrawerClose = useCallback(() => {
    if (brandApplyed.current !== brandSelected) {
      setBrandSelected(brandApplyed.current)
    }
    if (polishTypeApplyed.current !== polishTypeSelected) {
      setPolishTypeSelected(polishTypeApplyed.current)
    }
    if (
      !colorApplyed.current.every((color) =>
        colorSelected.some((c) => c.colorKey === color.colorKey),
      ) ||
      !colorSelected.every((color) =>
        colorApplyed.current.some((c) => c.colorKey === color.colorKey),
      )
    ) {
      setColorSelected(colorApplyed.current)
    }
  }, [brandSelected, polishTypeSelected, colorSelected])

  const handleApply = () => {
    const filter: PolishListFilterQuery = {}
    if (brandApplyed.current) {
      filter.brandId = brandApplyed.current.brandId
    }
    if (polishTypeApplyed.current) {
      filter.polishType = {
        typeId: polishTypeApplyed.current.typeId,
        isOfficial: polishTypeApplyed.current.isOfficial,
      }
    }
    if (colorApplyed.current.length) {
      filter.colorIds = colorApplyed.current.map((c) => c.colorKey)
    }
    onApply && onApply(filter)
  }

  const handleBrandClear = () => {
    if (!brandApplyed.current) return
    brandApplyed.current = null
    setBrandSelected(null)
    handleApply()
  }
  const handleBrandApply = () => {
    if (!brandSelected) return
    brandApplyed.current = brandSelected
    handleApply()
  }
  const handlePolishTypeClear = () => {
    if (!polishTypeApplyed.current) return
    polishTypeApplyed.current = null
    setPolishTypeSelected(null)
    handleApply()
  }
  const handlePolishTypeApply = () => {
    if (!polishTypeSelected) return
    polishTypeApplyed.current = polishTypeSelected
    handleApply()
  }
  const handleColorItemClick = (item: Color) => {
    if (colorSelected.some((c) => c.colorKey === item.colorKey)) {
      setColorSelected((prev) => prev.filter((c) => c.colorKey !== item.colorKey))
    } else {
      setColorSelected((prev) => [...prev, item])
    }
  }
  const handleColorClear = () => {
    if (!colorApplyed.current.length) return
    colorApplyed.current = []
    setColorSelected([])
    handleApply()
  }
  const handleColorApply = () => {
    if (!colorSelected.length) return
    colorApplyed.current = colorSelected
    handleApply()
  }

  const optionSelected = useMemo(() => {
    const selected: string[] = []
    if (brandSelected) {
      selected.push('brand')
    }
    if (polishTypeSelected) {
      selected.push('polishType')
    }
    if (colorSelected.length) {
      selected.push('colors')
    }
    return selected
  }, [brandSelected, polishTypeSelected, colorSelected])

  useImperativeHandle(ref, () => ({
    open: () => bottomFilterRef.current?.expand(),
    close: () => bottomFilterRef.current?.close(),
  }))
  return (
    <BottomFilters
      ref={bottomFilterRef}
      onClose={handleDrawerClose}
      optionSelected={optionSelected}>
      <BottomFilterOption name="brand" label="品牌">
        <View style={filterStyles.selectionWrapper}>
          <SelectList
            data={brands}
            renderItem={(item) => item.brandName}
            onItemPress={(item) => {
              setBrandSelected(item)
            }}
            isSelected={(item) => item.brandId === brandSelected?.brandId}
          />
          <FilterApplyButtons onApply={handleBrandApply} onClear={handleBrandClear} />
        </View>
      </BottomFilterOption>
      <BottomFilterOption name="polishType" label="色膠品牌">
        <View style={filterStyles.selectionWrapper}>
          <SelectList
            data={polishTypes}
            renderItem={(item) => item.name}
            onItemPress={(item) => {
              setPolishTypeSelected(item)
            }}
            isSelected={(item) => item.typeId === polishTypeSelected?.typeId}
          />
          <FilterApplyButtons onApply={handlePolishTypeApply} onClear={handlePolishTypeClear} />
        </View>
      </BottomFilterOption>
      <BottomFilterOption name="colors" label="顏色">
        <View style={filterStyles.selectionWrapper}>
          <SelectList
            data={colorTypes}
            renderItem={(item) => item.name}
            onItemPress={handleColorItemClick}
            isSelected={(item) => colorSelected.some((c) => c.colorKey === item.colorKey)}
          />
          <FilterApplyButtons onApply={handleColorApply} onClear={handleColorClear} />
        </View>
      </BottomFilterOption>
    </BottomFilters>
  )
})

const filterStyles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  selectionWrapper: {
    display: 'flex',
    height: '100%',
    // flexGrow: 1
  },
})
IndexFilters.displayName = 'IndexFilters'

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
  const db = useSQLiteContext()
  const filterRef = useRef<FiltersRef>(null)
  const [polishSectionData, setPolishData] = useState<SectionData>([])

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

  const handleIconPress = () => {
    filterRef.current?.open()
  }
  const handFilterApply = useCallback(
    (filter: PolishListFilterQuery) => {
      console.log(filter)
      filterRef.current?.close()
      getPolishList(db, filter).then((res) => {
        if (res.success) {
          const sectionData = res.data.series.map((s, i) => ({
            ...s,
            data: groupInRows<Polish>(res.data.polishItems[i], 3),
          }))
          setPolishData(sectionData)
        }
      })
    },
    [filterRef, db],
  )

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Flex justify="end" style={{ height: 60, width: '100%' }}>
          <View style={styles.iconWrapper}>
            <TouchableWithoutFeedback onPress={handleIconPress}>
              <View style={styles.filterIcon}>
                <Feather name="filter" size={18} />
              </View>
            </TouchableWithoutFeedback>
          </View>
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
      <IndexFilters ref={filterRef} onApply={handFilterApply} />
    </>
  )
}

const filterIconSize = 36
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
  iconWrapper: {
    position: 'relative',
    zIndex: 5,
  },
  filterIcon: {
    width: filterIconSize,
    height: filterIconSize,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: LINE_COLORS.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 10, spreadDistance: 0, color: 'rgba(144,144,144,0.2)' },
    ],
  },
})
