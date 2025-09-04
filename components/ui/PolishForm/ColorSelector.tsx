import { forwardRef, useCallback, useEffect, useImperativeHandle, useState, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { PolishColumnRef } from '@/components/ui/PolishForm/types'
import { useSQLiteContext } from 'expo-sqlite'
import useColorsApi from '@/db/queries/colors'
import { SPACING } from '@/constants/layout'
import { LINE_COLORS } from '@/constants/Colors'
import { ThemeText } from '@/components/layout/ThemeText'
import { Flex } from '@/components/layout/Flex'
import TagSelector from '@/components/ui/TagSelector'

type ColorSelectorProps = {
  values: string[]
}

const ColorSelector = forwardRef<PolishColumnRef<string[]>, ColorSelectorProps>((props, ref) => {
  const db = useSQLiteContext()
  const { getOfficialColors } = useColorsApi(db)
  const [colorsSelected, setSelected] = useState<string[]>(props.values)
  const [colorTypes, setColorTypes] = useState<string[]>([])

  useEffect(() => {
    getOfficialColors().then((response) => {
      if (!response.success) return
      setColorTypes(response.data)
    })
  }, [])

  const isColorSelected = useCallback(
    (color: string) => {
      return colorsSelected.includes(color)
      // return true
    },
    [colorsSelected],
  )

  const renderTag = useCallback((color: string) => color, [])
  const handleTagPress = useCallback(
    (color: string) => {
      if (colorsSelected.includes(color)) {
        setSelected((prev) => prev.filter((c) => c !== color))
      } else {
        setSelected((prev) => [...prev, color])
      }
    },
    [colorsSelected],
  )

  useImperativeHandle(ref, () => ({
    getValue: () => colorsSelected,
    setValue: (colors) => setSelected(colors),
  }))
  return (
    <View style={styles.container}>
      <Flex>
        <ThemeText>顏色</ThemeText>
      </Flex>
      <View style={{ marginTop: SPACING.md }}>
        <TagSelector
          data={colorTypes}
          isActive={isColorSelected}
          renderItem={renderTag}
          onTagPress={handleTagPress}
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingLeft: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: LINE_COLORS.second,
  },
})

ColorSelector.displayName = 'ColorSelector'
export default memo(ColorSelector)
