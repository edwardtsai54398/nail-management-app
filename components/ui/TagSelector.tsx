import { memo, ReactNode } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Flex } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import { SPACING } from '@/constants/layout'
import { LINE_COLORS, THEME_COLORS } from '@/constants/Colors'

type TagSelectorProps<T> = {
  data: T[]
  renderItem: (item: T) => string
  isActive?: (item: T) => boolean
  onTagPress?: (item: T) => void
  // type?: 'single' | 'multi'
  disabled?: boolean
}

const TagSelector = <T extends object | string>({
  data,
  renderItem,
  onTagPress,
  disabled,
  isActive,
}: TagSelectorProps<T>) => {
  const handleTagPress = (item: T) => {
    onTagPress && onTagPress(item)
  }

  if (data.length === 0) return null
  return (
    <Flex style={styles.tagsWrapper}>
      {data.map((item, i) => (
        <Pressable
          key={i}
          disabled={disabled}
          onPress={() => {
            handleTagPress(item)
          }}>
          <View
            style={[
              styles.tag,
              isActive && isActive(item) ? styles.activeTag : null,
              disabled ? styles.disabledTag : null,
            ]}>
            <ThemeText
              color={disabled ? 'subtle' : isActive && isActive(item) ? 'primary' : 'default'}>
              {renderItem(item)}
            </ThemeText>
          </View>
        </Pressable>
      ))}
    </Flex>
  )
}

const styles = StyleSheet.create({
  tagsWrapper: {
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: SPACING.sm * -1,
  },
  tag: {
    borderRadius: 10,
    padding: SPACING.sm,
    flexShrink: 0,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: LINE_COLORS.default,
    marginBottom: SPACING.sm,
  },
  activeTag: {
    borderColor: THEME_COLORS.primary,
  },
  disabledTag: {
    borderColor: LINE_COLORS.second,
  },
})
TagSelector.displayName = 'TagSelector'
export default memo(TagSelector) as <T extends object | string>(
  props: TagSelectorProps<T>,
) => ReactNode
// export default TagSelector
