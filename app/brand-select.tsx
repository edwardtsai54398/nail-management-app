import { useCallback, useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import AntDesign from '@expo/vector-icons/AntDesign'
import useBrandApi from '@/db/queries/brand'
import { useBrandStore } from '@/store/brands'
import { useSeriesStore } from '@/store/series'
import type { ParamsToBrandSelect } from '@/types/routes'
import type { Brand } from '@/types/ui'
import ThemeButton from '@/components/ui/ThemeButton'
import { SPACING } from '@/constants/layout'
import { Flex } from '@/components/layout/Flex'
import SelectList from '@/components/ui/SelectList'
import { uiStyles } from '@/assets/styles/ui'

export default function BrandSelect() {
  const router = useRouter()
  const params = useGlobalSearchParams<ParamsToBrandSelect>()
  const db = useSQLiteContext()
  const { createBrand } = useBrandApi(db)
  const brands = useBrandStore((state) => state.data)
  const setBrands = useBrandStore((state) => state.setData)
  const addSeries = useSeriesStore((state) => state.addData)
  const [brandIdSelected, setIdSelected] = useState<string>('')
  const [isAddBrandMode, setIsAddBrandMode] = useState(false)
  const [addBrandText, setAddBrandText] = useState<string>('')

  useEffect(() => {
    if (!params.brandId || !brands.some((b) => b.brandId === params.brandId)) return
    setIdSelected(params.brandId)
  }, [params])

  const renderItem = useCallback((b: Brand) => b.brandName, [])
  const isSelected = useCallback((b: Brand) => b.brandId === brandIdSelected, [brandIdSelected])
  const handleBrandItemPress = useCallback((b: Brand) => {
    setIdSelected(b.brandId)
  }, [])

  const handleGoBack = useCallback(() => {
    router.back()
    router.setParams({ brandId: brandIdSelected })
  }, [brandIdSelected, router])

  const handleCancelPress = () => {
    setIsAddBrandMode(false)
    setAddBrandText('')
  }

  const handleFinishPress = async () => {
    console.log('handleFinishPress')
    try {
      const response = await createBrand(addBrandText)
      if (!response.success) {
        console.error(response.error)
        return
      }
      const brand = response.data
      setBrands([brand, ...brands])
      addSeries(brand.brandId, [])
      setIdSelected(response.data.brandId)
    } catch (e) {
      console.error('CREATE BRAND ERROR:')
      console.error(e)
    } finally {
      setIsAddBrandMode(false)
      setAddBrandText('')
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          headerTitle: '選擇品牌',
          headerLeft: (props) => (
            <ThemeButton
              icon={<AntDesign name="left" size={16} />}
              label={'返回'}
              type="default"
              text
              onPress={handleGoBack}
            />
          ),
          headerRight: () =>
            !isAddBrandMode ? (
              <ThemeButton
                label="新增品牌"
                text
                onPress={() => {
                  setIsAddBrandMode(true)
                }}
              />
            ) : (
              <ThemeButton label="取消" text onPress={handleCancelPress} />
            ),
          headerBackVisible: false,
        }}
      />
      {isAddBrandMode ? (
        <Flex style={{ padding: SPACING.sm }}>
          <TextInput
            autoFocus={true}
            maxLength={25}
            numberOfLines={1}
            onChangeText={(val) => {
              setAddBrandText(val)
            }}
            placeholder={'輸入新品牌名稱'}
            style={[uiStyles.input, { flexGrow: 1, marginRight: SPACING.sm }]}
          />
          <ThemeButton
            text
            label={'完成'}
            disabled={addBrandText === ''}
            onPress={handleFinishPress}
          />
        </Flex>
      ) : null}
      <SelectList
        data={brands}
        renderItem={renderItem}
        isSelected={isSelected}
        onItemPress={handleBrandItemPress}
      />
    </>
  )
}
