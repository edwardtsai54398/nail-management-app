import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { useSeriesStore } from '@/store/series'
import { useCallback, useEffect, useState } from 'react'
import { Series } from '@/types/ui'
import { ParamsToSeriesSelect } from '@/types/routes'
import SelectList from '@/components/ui/SelectList'
import ThemeButton from '@/components/ui/ThemeButton'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Flex } from '@/components/layout/Flex'
import { SPACING } from '@/constants/layout'
import { TextInput } from 'react-native'
import { uiStyles } from '@/assets/styles/ui'
import { addSeries } from '@/db/queries/series'

export default function SeriesSelect() {
  const router = useRouter()
  const params = useGlobalSearchParams<ParamsToSeriesSelect>()
  const seriesMap = useSeriesStore((state) => state.seriesMap)
  const addSeriesData = useSeriesStore((state) => state.addData)
  const [seriesList, setSeriesList] = useState<Series[]>([])
  const [seriesIdSelected, setIdSelected] = useState<string>('')
  const [isAddSeriesMode, setIsAddSeriesMode] = useState(false)
  const [addSeriesText, setAddSeriesText] = useState<string>('')

  useEffect(() => {
    if (!params.brandId) return
    // console.log('series-select got brandId', params)
    if (!seriesMap.has(params.brandId)) {
      console.error(`brandId "${params.brandId}" is not exists`)
      router.back()
      return
    }
    setSeriesList(seriesMap.get(params.brandId)!)
  }, [seriesMap, params, router])

  useEffect(() => {
    if (!params.seriesId) return
    // console.log('series-select got seriesId', params)
    setIdSelected(params.seriesId)
  }, [params])

  const renderItem = useCallback((s: Series) => s.seriesName, [])
  const isSelected = useCallback((s: Series) => s.seriesId === seriesIdSelected, [seriesIdSelected])
  const handleSeriesItemPress = useCallback(
    (s: Series) => {
      setIdSelected(s.seriesId)
    },
    [setIdSelected],
  )

  const handleGoBack = useCallback(() => {
    router.back()
    router.setParams({ seriesId: seriesIdSelected })
  }, [seriesIdSelected, router])

  const handleCancelPress = () => {
    setIsAddSeriesMode(false)
    setAddSeriesText('')
  }

  const handleFinishPress = async () => {
    try {
      const response = await addSeries(params.brandId, addSeriesText)
      if (!response.success) return
      const { data } = response
      addSeriesData(data.brandId, [data])
      setIdSelected(data.seriesId)
      setIsAddSeriesMode(false)
      setAddSeriesText('')
    } catch (e) {
        console.error('CREATE_SERIES ERROR:')
        console.error(e)
    }
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          headerTitle: '選擇系列',
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
            !isAddSeriesMode ? (
              <ThemeButton
                label="新增系列"
                text
                onPress={() => {
                  setIsAddSeriesMode(true)
                }}
              />
            ) : (
              <ThemeButton label="取消" text onPress={handleCancelPress} />
            ),
          headerBackVisible: false,
        }}
      />
      {isAddSeriesMode ? (
        <Flex style={{ padding: SPACING.sm }}>
          <TextInput
            autoFocus={true}
            maxLength={25}
            numberOfLines={1}
            onChangeText={(val) => {
              setAddSeriesText(val)
            }}
            placeholder={'輸入系列名稱'}
            style={[uiStyles.input, { flexGrow: 1, marginRight: SPACING.sm }]}
          />
          <ThemeButton
            text
            label={'完成'}
            disabled={addSeriesText === ''}
            onPress={handleFinishPress}
          />
        </Flex>
      ) : null}
      <SelectList
        data={seriesList}
        isSelected={isSelected}
        renderItem={renderItem}
        onItemPress={handleSeriesItemPress}
      />
    </>
  )
}
