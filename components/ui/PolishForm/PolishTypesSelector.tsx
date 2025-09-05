import { StyleSheet, TextInput, View } from 'react-native'
import TagSelector from '@/components/ui/TagSelector'
import { SPACING } from '@/constants/layout'
import { ThemeText } from '@/components/layout/ThemeText'
import { Flex } from '@/components/layout/Flex'
import type { PolishType } from '@/types/ui'
import ThemeButton from '@/components/ui/ThemeButton'
import AntDesign from '@expo/vector-icons/AntDesign'
import { forwardRef, useCallback, useImperativeHandle, useState, memo, useEffect } from 'react'
import { uiStyles } from '@/assets/styles/ui'
import usePolishTypesApi from '@/db/queries/polishTypes'
import { useSQLiteContext } from 'expo-sqlite'
import { LINE_COLORS } from '@/constants/Colors'
import { PolishColumnRef } from '@/components/ui/PolishForm/types'
import { usePolishTypesStore } from '@/store/polishTypes'

type TypesSelectorProps = {
  val: PolishType | null
}

const PolishTypesSelector = forwardRef<PolishColumnRef<PolishType | null>, TypesSelectorProps>(
  (props, ref) => {
    const db = useSQLiteContext()
    const { createPolishType, getAllPolishTypes } = usePolishTypesApi(db)
    const polishTypes = usePolishTypesStore((state) => state.data)
    const setPolishTypes = usePolishTypesStore((state) => state.setData)
    const [isAddMode, setIsAddMode] = useState<boolean>(false)
    const [customPolishTypeName, setCustomPolishTypeName] = useState<string>('')
    const [typeSelected, setTypeSelected] = useState<PolishType | null>(props.val)

    useEffect(() => {
      if (polishTypes.length) return
      getAllPolishTypes().then((response) => {
        if (!response.success) {
          console.error(response.error)
          return
        }
        setPolishTypes(response.data)
      })
    }, [getAllPolishTypes, polishTypes, setPolishTypes])

    const handleTagPress = useCallback((item: PolishType) => {
      console.log('handleTagPress', item)
      setTypeSelected(item)
    }, [])
    const renderTag = useCallback((item: PolishType) => item.name, [])
    const isTypeSelected = useCallback(
      (item: PolishType) => {
        return typeSelected?.typeId === item.typeId
      },
      [typeSelected],
    )
    const handleAddPress = () => {
      setIsAddMode(true)
    }
    const handleFinishPress = async () => {
      try {
        const response = await createPolishType(customPolishTypeName)
        if (!response.success) return
        setPolishTypes([...polishTypes, response.data])
        setTypeSelected(response.data)
      } finally {
        setIsAddMode(false)
        setCustomPolishTypeName('')
      }
    }

    useImperativeHandle(ref, () => ({
      getValue: () => typeSelected,
      setValue: (val) => setTypeSelected(val),
    }))

    return (
      <View style={styles.container}>
        <Flex justify={'between'}>
          <ThemeText>色膠種類</ThemeText>
          {isAddMode ? (
            <ThemeButton
              type={'primary'}
              text
              label={'完成'}
              disabled={customPolishTypeName === ''}
              onPress={handleFinishPress}
            />
          ) : (
            <ThemeButton
              type={'default'}
              text
              icon={<AntDesign name={'pluscircleo'} size={18} />}
              onPress={handleAddPress}
            />
          )}
        </Flex>
        <View style={{ marginTop: SPACING.sm }}>
          <TagSelector
            data={polishTypes}
            isActive={isTypeSelected}
            disabled={isAddMode}
            renderItem={renderTag}
            onTagPress={handleTagPress}
          />
        </View>
        {isAddMode ? (
          <TextInput
            autoFocus={true}
            maxLength={25}
            numberOfLines={1}
            onChangeText={(val) => {
              setCustomPolishTypeName(val)
            }}
            placeholder={'輸入自訂色膠種類'}
            style={[uiStyles.input, { marginTop: SPACING.md }]}
          />
        ) : null}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: LINE_COLORS.second,
  },
})
PolishTypesSelector.displayName = 'PolishTypesSelector'

export default memo(PolishTypesSelector)
