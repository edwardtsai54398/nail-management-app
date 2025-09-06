import { Flex } from "@/components/layout/Flex";
import { LINE_COLORS } from "@/constants/Colors";
import { SPACING } from "@/constants/layout";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from 'expo-image-picker';
import { forwardRef } from "react";
import { Pressable, StyleSheet, View } from 'react-native';

const firstImgSize = 150

const ImagesPicker = forwardRef((props, ref) => {

  const handlePress = async () => {
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync()
    const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync()
    console.log(cameraPermission);
    console.log(mediaPermission);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })
    

    // const result = await ImagePicker.launchCameraAsync({
    //   mediaTypes: ['images'],
    //   allowsEditing: true,
    //   aspect: [16, 9],
    // })

    console.log(result);
    

  }
  return (
    <View style={styles.container}>
      <Flex justify="center">
        <Flex justify="center" style={[styles.imgWrapper, {width: firstImgSize, height: firstImgSize}]}>
          <Pressable onPress={handlePress}>

          <View>
            <AntDesign name={'pluscircleo'} szie={50}/>
          </View>
          </Pressable>
        </Flex>

      </Flex>
    </View>
  )
})



const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md
  },
  imgWrapper: {
    borderWidth: 1,
    borderColor: LINE_COLORS.default,
    borderRadius: 18
  }
})

ImagesPicker.displayName = 'ImagesPicker'

export default ImagesPicker