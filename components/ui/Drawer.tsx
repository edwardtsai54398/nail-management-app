import { OverlayContext } from '@/components/ui/OverlayProvider'
import { SPACING } from '@/constants/layout'
import { ReactNode, useContext, useEffect, useMemo } from 'react'
import { Animated, ScrollView, StyleSheet, useAnimatedValue, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type DrawerProps = {
  show: boolean
  children: ReactNode
  drawerHeight?: number
  onClose: () => void
  footer?: ReactNode
  direction?: 't-b' | 'b-t'
  containerStyles?: ViewStyle
}

export const drawerStyles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 2010,
    width: '100%',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  topDrawer: {
    top: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bottomDrawer: {
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  body: {
    flex: 1,
  },
  footer: {
    padding: SPACING.md,
  },
})

export default function Drawer({
  show,
  onClose,
  children,
  drawerHeight = 300,
  footer,
  direction = 't-b',
}: DrawerProps) {
  const { register, unregister, drawerOpenCount } = useContext(OverlayContext)
  const insets = useSafeAreaInsets()

  //animation
  const extraTranslateY = useMemo(
    () => (direction === 't-b' ? insets.top * -1 : insets.bottom),
    [direction, insets.top, insets.bottom],
  )
  const translateY = useAnimatedValue(
    drawerHeight * (direction === 't-b' ? -1 : 1) + extraTranslateY,
  )
  const duration = 250

  useEffect(() => {
    if (show) {
      register()
      setTimeout(() => {
        slideIn()
      }, 100)
    } else {
      slideOut()
      unregister()
    }
  }, [show])

  useEffect(() => {
    if (drawerOpenCount === 0 && show) {
      onClose()
    }
  }, [drawerOpenCount])

  const slideIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    console.log('slideIn')
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start()
  }

  const slideOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    console.log('slideOut')
    Animated.timing(translateY, {
      toValue: drawerHeight * (direction === 't-b' ? -1 : 1) + extraTranslateY,
      duration,
      useNativeDriver: true,
    }).start()
  }
  return (
    <Animated.View
      style={[
        drawerStyles.drawerContainer,
        direction === 't-b' ? drawerStyles.topDrawer : drawerStyles.bottomDrawer,
        {
          translateY: translateY,
          height: drawerHeight + (direction === 't-b' ? insets.top : insets.bottom),
        },
      ]}>
      <View style={{ height: direction === 't-b' ? insets.top : 0 }}></View>
      <ScrollView style={[drawerStyles.body]}>{children}</ScrollView>
      {footer ? (
        <View style={[drawerStyles.footer]}>
          {footer}
          {direction === 'b-t' ? <View style={{ height: insets.bottom }}></View> : null}
        </View>
      ) : null}
    </Animated.View>
  )
}
