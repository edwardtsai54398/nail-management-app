import { ReactNode } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'

type FloatingBtnProps = {
  position?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  zIndex?: number
  children: ReactNode
  onPress: () => void
}
const btnSize = 64

const styles = StyleSheet.create({
  btnContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: btnSize,
    height: btnSize,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 15, spreadDistance: 0, color: 'rgba(144,144,144,0.5)' },
    ],
    shadowColor: 'red',
  },
})

export default function FloatingBtn({
  children,
  zIndex = 50,
  position = { bottom: 30, right: 5 },
  onPress,
}: FloatingBtnProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.btnContainer, { ...position, zIndex }]}>
        {/*<ThemeText size="xl" color="default">*/}
        {children}
        {/*</ThemeText>*/}
      </View>
    </TouchableOpacity>
  )
}
