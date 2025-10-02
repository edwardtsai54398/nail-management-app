import { TEXT_COLORS, THEME_COLORS } from '@/constants/Colors'
import { SPACING } from '@/constants/layout'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Animated, Pressable, StyleSheet, useAnimatedValue, View } from 'react-native'
import { Flex } from '../layout/Flex'
import { ThemeText } from '../layout/ThemeText'
import ModalDrawer from './ModalDrawer'

type FilterOption = {
  name: string
  label: string
}

type BottomFiltersProps = {
  children: ReactNode
  onClose?: () => void
  optionSelected?: string[]
}

export type BottomFilterRef = {
  expand: () => void
  close: () => void
}

type BottomFiltersContextType = {
  register: (option: FilterOptionProps) => void
  updateChildren: (name: string, children: ReactNode) => void
}

const BottomFiltersContext = createContext<BottomFiltersContextType | null>(null)
const useBottomFiltersContext = () => {
  const ctx = useContext(BottomFiltersContext)
  if (!ctx) throw new Error('BottomFilterOption must be inside BottomFilters')
  return ctx
}
const BottomFilters = forwardRef<BottomFilterRef, BottomFiltersProps>(
  ({ children, onClose, optionSelected }, ref) => {
    const [isShow, setIsShow] = useState(false)
    const [drawerHeight, setDrawerHeight] = useState(500)
    const [options, setOptions] = useState<FilterOption[]>([])
    const [currentOptName, setCurrentOptName] = useState('')
    const [optChildren, setOptChildren] = useState<{ name: string; children: ReactNode }[]>([])

    const handleClose = useCallback(() => {
      setIsShow(false)
      setCurrentOptName(options[0].name)
    }, [setCurrentOptName, setIsShow, options])
    useEffect(() => {
      if (!isShow) {
        onClose && onClose()
      }
    }, [isShow])

    const register = useCallback((option: FilterOptionProps) => {
      setOptions((prev) => {
        if (prev.some((opt) => opt.name === option.name)) return prev
        return [...prev, { name: option.name, label: option.label }]
      })
      setOptChildren((prev) => [...prev, { name: option.name, children: option.children }])
    }, [])
    const updateChildren = useCallback(
      (name: string, children: ReactNode) => {
        console.log('updateChildren', name)

        setOptChildren((prev) => {
          const optChildrenIdx = prev.findIndex((opt) => opt.name === name)
          const newOptChildren = { name, children }
          if (optChildrenIdx > -1) {
            const newArr = [...prev]
            newArr.splice(optChildrenIdx, 1, newOptChildren)
            return newArr
          }
          return [...prev, newOptChildren]
        })
      },
      [setOptChildren],
    )
    const contextValue = useMemo(() => ({ register, updateChildren }), [register, updateChildren])

    useEffect(() => {
      if (options.length) {
        setCurrentOptName(options[0].name)
      }
    }, [options])

    useImperativeHandle(ref, () => ({
      expand: () => setIsShow(true),
      close: () => setIsShow(false),
    }))
    return (
      <BottomFiltersContext.Provider value={contextValue}>
        <ModalDrawer
          direction="b-t"
          show={isShow}
          drawerHeight={drawerHeight}
          onClose={handleClose}>
          {children}
          <View style={styles.container}>
            <Flex style={styles.optionsWrapper}>
              <View style={{ padding: SPACING.sm, marginRight: SPACING.sm }}>
                <Feather name="filter" size={20} />
              </View>
              {options.map((opt) => (
                <FilterTag
                  key={opt.name}
                  label={opt.label}
                  isTextActive={currentOptName === opt.name || optionSelected?.includes(opt.name)}
                  isDrawerActive={currentOptName === opt.name}
                  onPress={() => {
                    setCurrentOptName(opt.name)
                  }}
                />
              ))}
            </Flex>
            <View style={styles.childrenWrapper}>
              {optChildren.find((opt) => opt.name === currentOptName)?.children || <></>}
            </View>
          </View>
        </ModalDrawer>
      </BottomFiltersContext.Provider>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
  },
  optionsWrapper: {
    padding: SPACING.sm,
    paddingTop: SPACING.md,
  },
  childrenWrapper: {
    flex: 1,
  },
})

BottomFilters.displayName = 'BottomFilters'

export default BottomFilters

const tagStyles = StyleSheet.create({
  tag: {
    flexShrink: 0,
    borderRadius: 6,
    padding: SPACING.sm,
    backgroundColor: '#ccc',
    marginRight: SPACING.md,
  },
})

const FilterTag = ({
  label,
  isTextActive,
  isDrawerActive,
  onPress,
}: {
  label: string | ReactNode
  isTextActive?: boolean
  isDrawerActive?: boolean
  onPress?: () => void
}) => {
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

  const handlePress = () => {
    console.log('handlePress')
    onPress && onPress()
  }
  return (
    <Pressable onPress={handlePress}>
      <Flex style={[tagStyles.tag]}>
        <ThemeText size="xs" style={{ color: textColor as any }}>
          {label}
        </ThemeText>
        <Animated.View style={{ marginLeft: SPACING.sm, transform: [{ rotate }] }}>
          <ThemeText style={{ color: textColor as any }}>
            <FontAwesome name="caret-down" />
          </ThemeText>
        </Animated.View>
      </Flex>
    </Pressable>
  )
}

type FilterOptionProps = FilterOption & {
  children: ReactNode
  hasApplyed?: boolean
}

export const BottomFilterOption = ({ name, label, children, hasApplyed }: FilterOptionProps) => {
  const { register, updateChildren } = useBottomFiltersContext()
  useEffect(() => {
    register({ name, label, children })
  }, [])
  useEffect(() => {
    updateChildren(name, children)
  }, [children, name])
  return <></>
}
