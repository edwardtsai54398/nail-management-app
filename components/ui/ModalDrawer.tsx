import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { drawerStyles, type DrawerProps } from './Drawer'

const duration = 250

const ModalDrawer = ({
  show,
  onClose,
  children,
  drawerHeight = 300,
  footer,
  direction = 't-b',
  containerStyles,
}: DrawerProps) => {
  const [showModal, setShowModal] = useState(show)
  const insets = useSafeAreaInsets()

  //animation
  const extraTranslateY = useMemo(
    () => (direction === 't-b' ? insets.top * -1 : insets.bottom),
    [direction, insets.top, insets.bottom],
  )
  const translateY = useAnimatedValue(
    drawerHeight * (direction === 't-b' ? -1 : 1) + extraTranslateY,
  )
  const opacity = useAnimatedValue(0)

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

  const showOverlay = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start()
  }, [opacity])
  const hideOverlay = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setShowModal(false)
      }, 100)
    })
  }, [opacity, setShowModal])

  useEffect(() => {
    if (show) {
      setShowModal(true)
      slideIn()
      showOverlay()
    } else {
      slideOut()
      hideOverlay()
    }
  }, [hideOverlay, showOverlay, show])

  return (
    <Modal transparent animationType="none" visible={showModal} statusBarTranslucent={true}>
      {/* 遮罩 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: opacity }]} />
      </TouchableWithoutFeedback>

      {/* 抽屜 */}
      <Animated.View
        style={[
          drawerStyles.drawerContainer,
          direction === 't-b' ? drawerStyles.topDrawer : drawerStyles.bottomDrawer,
          {
            height: drawerHeight + (direction === 't-b' ? insets.top : insets.bottom),
            translateY: translateY,
          },
          containerStyles,
        ]}>
        <View style={{ height: direction === 't-b' ? insets.top : 0 }}></View>
        {children}
        {/* <ScrollView style={[drawerStyles.body]}></ScrollView> */}
        <View style={{ height: direction === 'b-t' ? insets.bottom : 0 }}></View>
        {footer ? (
          <View style={[drawerStyles.footer]}>
            {footer}
            {direction === 'b-t' ? <View style={{ height: insets.bottom }}></View> : null}
          </View>
        ) : null}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(144,144,144,0.5)',
  },
})

export default ModalDrawer
