import {useRef, useState} from 'react'
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {LINE_COLORS} from "@/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {ThemeText} from "@/components/layout/ThemeText";
import {useSharedValue} from "react-native-reanimated";

const filterIconSize = 36

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
})

const BottomFilters = () => {
  const [sheetSnap, setSheetSnap] = useState(-1)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleIconPress = () => {
    bottomSheetRef.current?.expand()
  }
  const handleSheetChanges = (e) => {
    console.log('handleSheetChanges', e)
  }
  const bottomSheetHeight = useSharedValue(500)
  return (
    <>
      <View style={styles.iconWrapper}>
        <TouchableWithoutFeedback onPress={handleIconPress}>
          <View style={styles.filterIcon}>
            <Feather name="filter" size={18}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    <GestureHandlerRootView>
      <BottomSheet ref={bottomSheetRef} index={sheetSnap} onChange={handleSheetChanges} snapPoints={[500, '50%', '90%']}>
        <BottomSheetView style={{height: 500}}>
          <ThemeText>Awesome !!!</ThemeText>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
    </>
  )
}

export default BottomFilters