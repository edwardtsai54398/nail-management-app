import { LINE_COLORS } from '@/constants/Colors'
import { Image } from 'expo-image'
import { ImageSourcePropType, StyleSheet } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

type ImageMaskEditorProps = {
  source: ImageSourcePropType
}

const ImageMaskEditor = ({ source }: ImageMaskEditorProps) => {
  const scale = useSharedValue(1)
  const saveScale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const saveRotation = useSharedValue(0)
  const translateX = useSharedValue(0)
  const saveTranslateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const saveTranslateY = useSharedValue(0)

  const imgRotationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
      { rotate: `${(rotation.value / Math.PI) * 180}deg` },
    ],
  }))
  const imgTranslateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }))

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      console.log('rotate', e.rotation)
      rotation.value = saveRotation.value + e.rotation
    })
    .onEnd(() => {
      saveRotation.value = rotation.value
    })

  const zoom = Gesture.Pinch()
    .onUpdate((e) => {
      console.log(e.scale)
      scale.value = saveScale.value * e.scale
    })
    .onEnd(() => {
      saveScale.value = scale.value
    })

  const drag = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = saveTranslateX.value + e.translationX
      translateY.value = saveTranslateY.value + e.translationY
    })
    .onEnd(() => {
      saveTranslateX.value = translateX.value
      saveTranslateY.value = translateY.value
    })

  return (
    <GestureHandlerRootView style={[styles.maskWrapper, styles.maskEditor]}>
      <GestureDetector gesture={drag}>
        <Animated.View style={[styles.imgWrapper, imgTranslateStyle]}>
          <GestureDetector gesture={zoom}>
            <GestureDetector gesture={rotate}>
              <Animated.View style={[styles.imgWrapper, imgRotationStyle]}>
                <Image source={source} contentFit="contain" style={[styles.imgBehindMask]} />
              </Animated.View>
            </GestureDetector>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  maskWrapper: {
    width: 300,
    aspectRatio: '1/1',
    position: 'relative',
  },
  maskEditor: {
    borderWidth: 2,
    borderColor: LINE_COLORS.default,
  },
  imgWrapper: {
    width: '100%',
    height: '100%',
  },
  imgBehindMask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: 'auto',
  },
})

export default ImageMaskEditor
