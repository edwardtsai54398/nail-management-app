import { StyleSheet } from 'react-native'
import { SPACING } from '@/constants/layout'
import { LINE_COLORS } from '@/constants/Colors'
import { ReactNode } from 'react'
import { BlurView } from 'expo-blur'
import { Flex, type FlexJustify } from '@/components/layout/Flex'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type TopBarProps = {
  children: ReactNode
  height?: number
  justify?: FlexJustify
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 2050,
    borderBottomWidth: 1,
    borderBottomColor: LINE_COLORS.second,
    backgroundColor: 'white',
  },
})

export default function TopBar({ children, height = 48, justify }: TopBarProps) {
  const insets = useSafeAreaInsets()
  return (
    <BlurView style={[styles.container, { paddingTop: insets.top }]} intensity={100}>
      <Flex justify={justify} align="center" style={{ height }}>
        {children}
      </Flex>
    </BlurView>
  )
}
