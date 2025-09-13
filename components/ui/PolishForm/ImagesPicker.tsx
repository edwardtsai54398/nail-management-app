import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import Svg, { Ellipse } from 'react-native-svg'
import { useActionSheet } from '@expo/react-native-action-sheet'
import MaskedView from '@react-native-masked-view/masked-view'
import AntDesign from '@expo/vector-icons/AntDesign'
import { LINE_COLORS } from '@/constants/Colors'
import { PolishColumnRef } from './types'
import { SPACING } from '@/constants/layout'
import { Flex } from '@/components/layout/Flex'

type NailMaskProps = {
  height: number
  width: number
  children: ReactNode
}

const NailMask = ({ height, width, children }: NailMaskProps) => {
  //橢圓 svg
  const ovalHeight = height * 0.7
  const ovalWidth = ovalHeight * 0.8
  const cx = ovalWidth / 2
  const cy = ovalHeight / 2
  const rx = ovalWidth * 0.4
  const ry = ovalHeight * 0.4

  return (
    <MaskedView
      style={{ width: width, height: height }}
      maskElement={
        <Flex justify="center" style={{ width: '100%', height: '100%' }}>
          <Svg height={ovalHeight} width={ovalWidth}>
            <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={'black'} />
          </Svg>
        </Flex>
      }>
      {children}
      {/* <View style={{backgroundColor: '#faa', width: firstImgSize, height: firstImgSize}}></View> */}
    </MaskedView>
  )
}

type ImagesPickerProps = {
  size?: number
  imgSource?: string
}

const ImagesPicker = forwardRef<PolishColumnRef<string>, ImagesPickerProps>(
  ({ size = 150, imgSource = '' }, ref) => {
    const { showActionSheetWithOptions } = useActionSheet()
    const [imgPath, setImgPath] = useState(imgSource)

    const showActionSheet = () => {
      const options = ['拍照', '選擇照片', '取消']
      const cancelButtonIndex = 2

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (selectedIdx) => {
          switch (selectedIdx) {
            case 0:
              handleOpenCamera()
              break
            case 1:
              handleChoosePhoto()
              break
            case cancelButtonIndex:
              break
          }
        },
      )
    }

    const handleChoosePhoto = async () => {
      const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync()
      console.log(mediaPermission)
      if (!mediaPermission.granted || mediaPermission.accessPrivileges !== 'all') {
        console.log('requestMediaLibraryPermissionsAsync')

        await ImagePicker.requestMediaLibraryPermissionsAsync()
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.assets) return
      console.log(result.assets[0].uri)
      setImgPath(result.assets[0].uri)
    }

    const handleOpenCamera = async () => {
      const cameraPermission = await ImagePicker.getCameraPermissionsAsync()
      console.log(cameraPermission)
      if (!cameraPermission.granted) {
        console.log('requestCameraPermissionsAsync')

        await ImagePicker.requestCameraPermissionsAsync()
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        // allowsEditing: true,
        aspect: [1, 1],
      })
      console.log(result)

      if (!result.assets) return
      console.log(result.assets[0].uri)
      setImgPath(result.assets[0].uri)
    }

    useImperativeHandle(ref, () => ({
      getValue: () => imgPath,
      setValue: (val) => setImgPath(val),
    }))
    return (
      <>
        <View style={styles.container}>
          <Flex justify="center">
            <Flex justify="center" style={[styles.imgWrapper, { width: size, height: size }]}>
              <Pressable style={styles.imgPlaceHolderWrapper} onPress={showActionSheet}>
                {imgPath ? (
                  <Image source={{ uri: imgPath }} contentFit="cover" style={styles.img} />
                ) : (
                  <View style={styles.imgPlaceHolderWrapper}>
                    <AntDesign name={'pluscircleo'} size={40} />
                  </View>
                )}
              </Pressable>
            </Flex>
          </Flex>
        </View>
      </>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md,
  },
  imgPlaceHolderWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWrapper: {
    borderWidth: 1,
    borderColor: LINE_COLORS.default,
    borderRadius: 18,
    overflow: 'hidden',
  },
  btnsWrapper: {
    paddingHorizontal: SPACING.md,
  },
  drawerButton: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgb(245,245,245)',
  },
  cameraBtn: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  photoBtn: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: 1,
    borderTopColor: LINE_COLORS.second,
  },
  cancelBtn: {
    marginTop: SPACING.md,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  maskWrapper: {
    width: '100%',
    aspectRatio: '1/1',
    position: 'relative',
  },
  maskEditor: {
    borderWidth: 2,
    borderColor: LINE_COLORS.default,
  },
  imgBehindMask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: 'auto',
  },
})

ImagesPicker.displayName = 'ImagesPicker'

export default ImagesPicker
