import { ThemeText } from '@/components/layout/ThemeText'
import { LINE_COLORS, TEXT_COLORS, THEME_COLORS } from '@/constants/Colors'
import { SPACING } from '@/constants/layout'
import Feather from '@expo/vector-icons/Feather'
import { BlurView } from 'expo-blur'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  createContext,
  ReactNode,
  useRef, useMemo,
  useContext,
  useEffect,
  useState, useCallback,
  SetStateAction,
  Dispatch,
  forwardRef, useImperativeHandle
} from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from 'react-native'
import { Flex } from '../layout/Flex'
import ThemeButton from "@/components/ui/ThemeButton";

const filterIconSize = 36
const filterBarOversize = 10
const drawerOpenDuration = 350
const barCloseDuration = 250
const barWidthExpandDuration = 300
const barCircleScaleDuration = 100

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'relative',
    zIndex: 5
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
  filtersWrapper: {
    position: 'absolute',
    zIndex: -1,
    right: 0,
    top: 0,
    width: filterIconSize,
    height: filterIconSize,
    // overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  filtersWrapperBg: {
    backgroundColor: '#d6d6d6',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 8, spreadDistance: 0, color: 'rgba(144,144,144,0.5)', inset: true },
    ],
  },
  filterLabelsWrapper: {
    flexGrow: 1,
    paddingRight: filterIconSize
  },
  filterLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    // flex: 1,
    flexGrow: 1,
    flexShrink: 0
  },
})

export type FilterOption = {
  name: string
  label: string
}

type FilterContextType = {
  drawerOpenName: string
  setDrawerOpenedOptName: Dispatch<SetStateAction<string>>
}

const FiltersContext = createContext<FilterContextType | null>(null)

type TopFiltersProps = {
  options: FilterOption[]
  children: ReactNode
  optionsSelected: string[],
}
export type TopFiltersRef = {
  drawerOpenName: string
}

const TopFilters = forwardRef<TopFiltersRef, TopFiltersProps>(({options, children, optionsSelected}, ref) => {
  const {width: deviceWidth} = Dimensions.get('window')
  const [isBarOpen, setBarOpen] = useState(false)
  const [drawerOpenedOptName, setDrawerOpenedOptName] = useState('')

  const handleLabelPress = useCallback((name: string) => {
    if (drawerOpenedOptName === name) {
      setDrawerOpenedOptName('')
    } else {
      setDrawerOpenedOptName(name)
    }
  }, [setDrawerOpenedOptName, drawerOpenedOptName])

  //bar animation
  const translateX = useAnimatedValue(0)
  const translateY = useAnimatedValue(0)
  const barBorderRadius = useAnimatedValue(filterIconSize / 2)
  const widthAnimationValue = useAnimatedValue(0)
  const barWidth = widthAnimationValue.interpolate({
    inputRange: [0,0.5,1],
    outputRange: [filterIconSize, filterIconSize + filterBarOversize, deviceWidth - (SPACING.lg * 2)]
  })
  const barHeight = useAnimatedValue(filterIconSize)
  const barOpenRef = useRef(false)
  const openBarAnimation = useCallback(() => {
    if(barOpenRef.current) return
    barOpenRef.current = true
    Animated.timing(widthAnimationValue, {
      toValue: 0.5,
      duration: barCircleScaleDuration,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(widthAnimationValue, {
        toValue: 1,
        duration: barWidthExpandDuration,
        useNativeDriver: false,
      }).start()
    })
    Animated.timing(barHeight, {
      toValue: filterIconSize + filterBarOversize,
      duration: barCircleScaleDuration,
      useNativeDriver: false,
    }).start()
    Animated.timing(translateX,{
      toValue: filterBarOversize / 2,
      duration: barCircleScaleDuration,
      useNativeDriver: false,
    }).start()
    Animated.timing(translateY,{
      toValue: (filterBarOversize / 2) * -1,
      duration: barCircleScaleDuration,
      useNativeDriver: false,
    }).start()
    Animated.timing(barBorderRadius,{
      toValue: (filterIconSize + filterBarOversize) / 2,
      duration: barCircleScaleDuration,
      useNativeDriver: false,
    }).start()
  }, [widthAnimationValue,barHeight, translateX, translateY, barBorderRadius])
  const closeBarAnimation = useCallback((delay = 0) => {
    if (!barOpenRef.current) return // 已經關了，就不跑動畫
    barOpenRef.current = false
    Animated.timing(widthAnimationValue, {
      toValue: 0,
      duration: barCloseDuration,
      useNativeDriver: false,
      delay,
    }).start()
    Animated.timing(barHeight, {
      toValue: filterIconSize,
      duration: barCloseDuration,
      useNativeDriver: false,
      delay,
    }).start()
    Animated.timing(translateX, {
      toValue: 0,
      duration: barCloseDuration,
      delay,
      useNativeDriver: false,
    }).start()
    Animated.timing(translateY, {
      toValue: 0,
      duration: barCloseDuration,
      delay,
      useNativeDriver: false,
    }).start()
    Animated.timing(barBorderRadius,{
      toValue: filterIconSize / 2,
      duration: barCloseDuration,
      delay,
      useNativeDriver: false,
    }).start()
  }, [widthAnimationValue, barHeight, translateX, translateY, barBorderRadius])

  useEffect(() => {
    if(isBarOpen) {
      if(!drawerOpenedOptName) {
        openBarAnimation()
      }
    } else {
      if (!drawerOpenedOptName) {
        closeBarAnimation()
      } else {
        setDrawerOpenedOptName('')
        closeBarAnimation(drawerOpenDuration)
      }
    }
  }, [isBarOpen, openBarAnimation, closeBarAnimation, setDrawerOpenedOptName, drawerOpenedOptName])

  const contextValue = useMemo(() => {

    return {
      drawerOpenName: drawerOpenedOptName,
      setDrawerOpenedOptName
    }
  }, [drawerOpenedOptName, setDrawerOpenedOptName])

  useImperativeHandle(ref, () => ({
    drawerOpenName: drawerOpenedOptName
  }))
  return (
    <FiltersContext.Provider value={contextValue}>
      <View style={styles.iconWrapper}>
        <TouchableWithoutFeedback onPress={() => setBarOpen(!isBarOpen)}>
          <View style={styles.filterIcon}>
            <Feather name="filter" size={18}/>
          </View>
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.filtersWrapper, {transform: [{translateX}, {translateY}], width: barWidth, height: barHeight}]}>
          {children}
          <Animated.View style={[styles.filtersWrapperBg, {borderRadius: barBorderRadius}]}>

            <Flex justify="center" style={styles.filterLabelsWrapper}>
              {options.map(opt => (
                <FilterLabel
                  key={opt.name}
                  label={opt.label}
                  isTextActive={optionsSelected.includes(opt.name) || drawerOpenedOptName === opt.name}
                  isDrawerActive={drawerOpenedOptName === opt.name}
                  onPress={() => {handleLabelPress(opt.name)}}
                />
              ))}
              {/*<FilterLabel label="品牌" isTextActive={false} isDrawerActive={false} />*/}
              {/*<FilterLabel label="色膠種類" isTextActive={false} isDrawerActive={false} />*/}

            </Flex>
          </Animated.View>
        </Animated.View>
      </View>

    </FiltersContext.Provider>
  )
})

export default TopFilters
TopFilters.displayName = 'TopFilters'


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
      <View style={[styles.filterLabel]}>
        <ThemeText size="xs" style={{ color: textColor as any }}>{label}</ThemeText>
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
  onConfirm?: () => void
  name: string
  drawerHeight?: number
}

const drawerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    left: 0,
    zIndex: -2,
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  blurContainer: {
    backgroundColor: 'rgba(227,227,227,0.9)',
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
    height: '100%',
    paddingTop: (filterIconSize / 2) + filterBarOversize + SPACING.sm,
    paddingBottom: 48
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: SPACING.sm,
  }
})
export const TopFilterOption = ({
  children,
  onConfirm,
  name,
                  drawerHeight = 300,
}: OptionComponentProps) => {
  const context = useContext(FiltersContext)

  //height animation
  const height = useAnimatedValue(0)
  const openDrawerAnimation = useCallback(() => {
    Animated.timing(height, {
      toValue: drawerHeight,
      duration: drawerOpenDuration,
      useNativeDriver: false,
    }).start()
  }, [height, drawerHeight])
  const closeDrawerAnimation = useCallback(() => {
    Animated.timing(height, {
      toValue: 0,
      duration: drawerOpenDuration,
      useNativeDriver: false,
    }).start()
    }, [height])

  useEffect(() => {
    if (!context) return
    if (context.drawerOpenName === name) {
      // setDrawerShow(true)
      openDrawerAnimation()
    } else {
      closeDrawerAnimation()
    }
  }, [context, name, openDrawerAnimation, closeDrawerAnimation]);
  const handleConfirm = () => {
    context?.setDrawerOpenedOptName('')
    onConfirm && onConfirm()
  }


  if (!context) return null

  return (
    <Animated.View style={[drawerStyles.container, {height}]}>
      <BlurView intensity={100} style={drawerStyles.blurContainer}>

        {children}
        <View style={drawerStyles.buttonWrapper}>
          <ThemeButton label="確認" onPress={handleConfirm}></ThemeButton>
        </View>
      </BlurView>
    </Animated.View>
  )
}
