
import { ThemeText } from '@/components/layout/ThemeText'
import { LINE_COLORS, TEXT_COLORS, THEME_COLORS } from '@/constants/Colors'
import { SPACING } from '@/constants/layout'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  Animated,
  Button,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from 'react-native'
import { Flex } from '../layout/Flex'
import Drawer from './Drawer'

const filterIconSize = 36

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'relative'
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
    backgroundColor: '#eee'
  },
  filtersWrapper: {
    position: 'absolute',
    zIndex: -1,
    right: 0,
    top: 0,
    width: filterIconSize,
    height: filterIconSize,
    backgroundColor: '#999',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  filterLabelsWrapper: {
    flexGrow: 1,
    paddingRight: filterIconSize
  },
  filterButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    flex: 1,
  },
})

type FilterOptionProps = {
  name: string
  label: string
  renderLabel?: (label: string) => ReactNode
  isLabelActive?: boolean
}

type FilterContextType = {
  options: FilterOptionProps[]
  setOptions: Dispatch<SetStateAction<FilterOptionProps[]>>
  drawerName: string
  setDrawerName: Dispatch<SetStateAction<string>>
  labelActive: string[]
  setLabelActive: Dispatch<SetStateAction<string[]>>
}

const FiltersContext = createContext<FilterContextType | null>(null)

const filterBarOversize = 10
export default function TopFilters() {
  const {width: deviceWidth} = Dimensions.get('window')
  const [isBarOpen, setBarOpen] = useState(false)
  const translateX = useAnimatedValue(0)
  const translateY = useAnimatedValue(0)
  const barBorderRadius = useAnimatedValue(filterIconSize / 2)
  const widthAnimationValue = useAnimatedValue(0)
  const barWidth = widthAnimationValue.interpolate({
    inputRange: [0,0.5,1],
    outputRange: [filterIconSize, filterIconSize + filterBarOversize, deviceWidth - (SPACING.lg * 2)]
  })
  const barHeight = useAnimatedValue(filterIconSize)
  const [options, setOptions] = useState<FilterOptionProps[]>([])

  useEffect(() => {
    if(isBarOpen) {
      Animated.timing(widthAnimationValue, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(widthAnimationValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start()
      })
      Animated.timing(barHeight, {
        toValue: filterIconSize + filterBarOversize,
        duration: 100,
        useNativeDriver: false,
      }).start()
      Animated.timing(translateX,{
        toValue: filterBarOversize / 2,
        duration: 100,
        useNativeDriver: false,
      }).start()
      Animated.timing(translateY,{
        toValue: (filterBarOversize / 2) * -1,
        duration: 100,
        useNativeDriver: false,
      }).start()
      Animated.timing(barBorderRadius,{
        toValue: (filterIconSize + filterBarOversize) / 2,
        duration: 100,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(widthAnimationValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
      Animated.timing(barHeight, {
        toValue: filterIconSize,
        duration: 250,
        useNativeDriver: false,
      }).start()
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start()
      Animated.timing(barBorderRadius,{
        toValue: filterIconSize / 2,
        duration: 250,
        useNativeDriver: false,
      }).start()
    }
  }, [isBarOpen])


  return (
      <View style={styles.iconWrapper}>
        
        <TouchableWithoutFeedback onPress={() => setBarOpen(!isBarOpen)}>
          <View style={styles.filterIcon}>
            <Feather name="filter" size={18}/>
            
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.filtersWrapper,{padding: filterBarOversize}, {transform: [{translateX}, {translateY}], borderRadius: barBorderRadius, width: barWidth, height: barHeight}]}>
          <Flex justify="center" style={styles.filterLabelsWrapper}>
            <FilterLabel label="品牌" isTextActive={false} isDrawerActive={false} />
            <FilterLabel label="色膠種類" isTextActive={false} isDrawerActive={false} />
          </Flex>
        </Animated.View>
      </View>
  )
}

function FilterLabel({
  label,
  isTextActive,
  isDrawerActive,
  onPress,
}: {
  label: string | ReactNode
  isTextActive: boolean
  isDrawerActive: boolean
  onPress?: () => void
}) {
  const colorAnim = useAnimatedValue(isTextActive ? 1 : 0)
  const rotateAnim = useAnimatedValue(isDrawerActive ? 1 : 0)

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isTextActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // 顏色不能用 native driver
    }).start()

    Animated.timing(rotateAnim, {
      toValue: isDrawerActive ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isTextActive, isDrawerActive, colorAnim, rotateAnim])

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isDrawerActive ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isDrawerActive, rotateAnim])

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [TEXT_COLORS.default, THEME_COLORS.primary],
  })
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.filterButton]}>
        <ThemeText style={{ color: textColor as any }}>{label}</ThemeText>
        <Animated.View style={{ marginLeft: SPACING.sm, transform: [{ rotate }] }}>
          <ThemeText style={{ color: textColor as any }}>
            <FontAwesome name="caret-down" />
          </ThemeText>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
}

type OptionComponentProps = {
  children?: ReactNode
  onConfirm: () => void
} & FilterOptionProps

function Option({
  children,
  onConfirm,
  label,
  renderLabel,
  name,
  isLabelActive,
}: OptionComponentProps) {
  const context = useContext(FiltersContext)
  const [drawerShow, setDrawerShow] = useState<boolean>(false)
  useEffect(() => {
    if (!context) return
    if (context.options.length > 0) return
    context.setOptions((prev) => [...prev, { label, renderLabel, name }])
  }, [label])

  useEffect(() => {
    if (!context) return
    setDrawerShow(context.drawerName === name)
  }, [context?.drawerName])

  useEffect(() => {
    if (!context) return
    console.log(name, isLabelActive)
    if (isLabelActive && !context.labelActive.find((label) => label === name)) {
      context.setLabelActive((prev) => [...prev, name])
    } else if (!isLabelActive && context.labelActive.find((label) => label === name)) {
      context.setLabelActive((prev) => prev.filter((label) => label !== name))
    }
    console.log(context.labelActive)
  }, [isLabelActive])

  if (!context) return null

  return (
    // <></>
    <Drawer
      show={drawerShow}
      onClose={() => {
        setDrawerShow(false)
        context.setDrawerName('')
      }}
      footer={<Button title={'Confirm'} onPress={onConfirm}></Button>}>
      <View style={{ paddingTop: 48 }}>{children}</View>
    </Drawer>
  )
}

TopFilters.Option = Option
