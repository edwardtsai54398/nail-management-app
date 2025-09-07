import { Flex } from "@/components/layout/Flex";
import { LINE_COLORS } from "@/constants/Colors";
import { SPACING } from "@/constants/layout";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { forwardRef, ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

const firstImgSize = 150

type NailMaskProps = {
  height: number
  width: number
  children: ReactNode
}

const NailMask = ({height, width, children}: NailMaskProps) => {


  //橢圓 svg
  const ovalHeight = height *0.7
  const ovalWidth = ovalHeight * 0.8
  const cx = ovalWidth / 2
  const cy = ovalHeight / 2
  const rx = ovalWidth * 0.4
  const ry = ovalHeight * 0.4

  return (
    <MaskedView 
      style={{width: width, height: height}}
      maskElement={
        <Flex justify="center" style={{width: '100%', height: '100%'}}>

      <Svg height={ovalHeight} width={ovalWidth}>
        <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={'black'}/>
      </Svg>
        </Flex>
      }
    >
      {children}
      {/* <View style={{backgroundColor: '#faa', width: firstImgSize, height: firstImgSize}}></View> */}
    </MaskedView>
    
  )
}




const ImagesPicker = forwardRef((props, ref) => {
  const [imgPath, setImgPath] = useState('')

  const handleChoosePhoto = async () => {
    const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync()
    console.log(mediaPermission);
    if(!mediaPermission.granted || mediaPermission.accessPrivileges !== 'all') {
      console.log('requestMediaLibraryPermissionsAsync');
      
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1
    })

    if(!result.assets) return
    console.log(result.assets[0].uri);
    setImgPath(result.assets[0].uri)
    
  }

  const handleOpenCamera = async () => {

    const cameraPermission = await ImagePicker.getCameraPermissionsAsync()
    console.log(cameraPermission);
    if(!cameraPermission.granted) {
      console.log('requestCameraPermissionsAsync');
      
      await ImagePicker.requestCameraPermissionsAsync()
    }
    

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      // allowsEditing: true,
      // aspect: [1, 1],
    })
    console.log(result);
    

    if(!result.assets) return
    console.log(result.assets[0].uri);
    setImgPath(result.assets[0].uri)
  }
  return (
    <View style={styles.container}>
      <Flex justify="center">
        <Flex justify="center" style={[styles.imgWrapper, {width: firstImgSize, height: firstImgSize}]}>
          {imgPath ? 
            //  : 
            <NailMask height={firstImgSize} width={firstImgSize} >
              <Image source={{uri: imgPath}} contentFit="cover" style={styles.img} />
            </NailMask> : 
            <Pressable onPress={handleOpenCamera}>
              <View style={{padding: SPACING.md, backgroundColor: '#fa0'}}>
                <AntDesign name={'pluscircleo'} szie={50}/>
              </View>
            </Pressable>
        }
        
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
    borderRadius: 18,
    overflow: 'hidden'
  },
  img: {
    width: '100%',
    height: '100%'
  }
})

ImagesPicker.displayName = 'ImagesPicker'

export default ImagesPicker