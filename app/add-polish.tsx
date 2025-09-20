import PolishForm from '@/components/ui/PolishForm/PolishForm'
import type {
  ParamsFromSelection,
  PolishFormRef,
  PolishFormValues,
} from '@/components/ui/PolishForm/types'
import ThemeButton from '@/components/ui/ThemeButton'
import { SPACING } from '@/constants/layout'
import { createPolishItem, CreatePolishQuery } from '@/db/queries/polishItem'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter, Stack, useGlobalSearchParams, useNavigation } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useRef } from 'react'
import { ScrollView, StyleSheet, View, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AddPolish() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const navigation = useNavigation()
  const db = useSQLiteContext()
  const params = useGlobalSearchParams<ParamsFromSelection>()
  const initValues: PolishFormValues = {
    brandId: '',
    seriesId: '',
    colorName: '',
    polishType: null,
    colorIds: [],
    stock: 1,
    isFavorites: false,
    tagIds: [],
    note: '',
    images: [],
  }

  const formRef = useRef<PolishFormRef>(null)

  useEffect(() => {
    if (!formRef.current) return
    if (params.brandId) {
      console.log('set brandId', params)
      formRef.current.setValue('brandId', params.brandId)
    }
    if (params.seriesId) {
      console.log('set seriesId', params)
      formRef.current.setValue('seriesId', params.seriesId)
    }
    if (params.tagIds) {
      console.log('set tagIds', params)
      const tagIds = JSON.parse(params.tagIds) as string[]
      formRef.current.setValue('tagIds', tagIds)
    }
  }, [params])

  const handleSaveClick = () => {
    if (!formRef.current) return
    const values = formRef.current.getValues()
    console.log('handleSaveClick')
    console.log(values)

    if (!values.seriesId) {
      Alert.alert('請選擇系列', '', [{ text: 'OK', style: 'cancel' }])
      return
    }

    if (!values.colorName) {
      Alert.alert('請填寫色號名稱', '', [{ text: 'OK', style: 'cancel' }])
      return
    }
    if (!values.polishType) {
      Alert.alert('請選擇色膠種類', '', [{ text: 'OK', style: 'cancel' }])
      return
    }
    if (values.colorIds.length < 1) {
      Alert.alert('請選擇至少一種顏色', '', [{ text: 'OK', style: 'cancel' }])
      return
    }
    if (values.images.length < 1) {
      Alert.alert('請使用至少一張照片或圖片', '', [{ text: 'OK', style: 'cancel' }])
      return
    }
    const payload: CreatePolishQuery = {
      seriesId: values.seriesId,
      polishName: values.colorName,
      polishType: {
        id: values.polishType.typeId,
        isOfficial: values.polishType.isOfficial,
      },
      colorIds: values.colorIds,
      stock: values.stock,
      isFavorites: values.isFavorites,
      tagIds: values.tagIds,
      note: '',
      images: values.images,
    }
    createPolishItem(db, payload).then((response) => {
      if (!response.success) {
        console.error(response.error)
        return
      }
      console.log('Create polishItem Success!!!')
      console.log(response.data)
      router.navigate('/(tabs)')
    })
  }
  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerTitle: '建立色膠',
          headerLeft: (props) => (
            <ThemeButton
              icon={<AntDesign name="close" size={26} />}
              type="default"
              text
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => <ThemeButton label="儲存" text onPress={handleSaveClick} />,
          headerBackVisible: false,
        }}
      />

      <ScrollView style={[styles.container, { marginBottom: insets.bottom }]}>
        <View style={{ marginBottom: insets.bottom }}>
          <PolishForm ref={formRef} initValues={initValues} />
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
})
