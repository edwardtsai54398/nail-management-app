import { memo, forwardRef, useState, useCallback, useImperativeHandle, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useTagStore } from '@/store/tags'
import { getTags } from '@/db/queries/tags'
import { SPACING } from '@/constants/layout'
import { PolishColumnRef, PolishFormValues } from './types'
import { Flex } from '@/components/layout/Flex'
import { ThemeText } from '@/components/layout/ThemeText'
import DetailInput from '@/components/ui/DetailInput'
import { LINE_COLORS } from '@/constants/Colors'

type TagsDisplayProps = {
  values: PolishFormValues['tagIds']
}

const TagsDisplay = forwardRef<PolishColumnRef<PolishFormValues['tagIds']>, TagsDisplayProps>(
  (props, ref) => {
    const router = useRouter()
    const db = useSQLiteContext()
    const allTags = useTagStore((state) => state.data)
    const setAllTags = useTagStore((state) => state.setData)
    const [tagIds, setTagIds] = useState<string[]>(props.values)

    useEffect(() => {
      if (allTags.length || tagIds.length === 0) return
      console.log('fetch tags')
      getTags(db).then((response) => {
        if (!response.success) return
        setAllTags(response.data)
      })
    }, [db, allTags, setAllTags, tagIds])

    const handleDetailInputPress = useCallback(() => {
      if (tagIds.length === 0) {
        router.navigate('/tags-select')
      } else {
        router.navigate({
          pathname: '/tags-select',
          params: { tagIds: JSON.stringify(tagIds) },
        })
      }
    }, [tagIds, router])

    useImperativeHandle(ref, () => ({
      getValue: () => tagIds,
      setValue: (tagIds) => setTagIds(tagIds),
    }))
    return (
      <View style={styles.container}>
        <DetailInput
          label={'標籤'}
          value={''}
          type={'select'}
          onSelectPress={handleDetailInputPress}
        />
        {tagIds.length ? (
          <View>
            <Flex style={styles.tagsWrapper}>
              {tagIds.map((tId) => (
                <View key={tId} style={styles.tag}>
                  <ThemeText>{allTags.find((t) => t.tagId === tId)?.name || ''}</ThemeText>
                </View>
              ))}
            </Flex>
          </View>
        ) : null}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: LINE_COLORS.second
  },
  tagsWrapper: {
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  tag: {
    borderRadius: 10,
    backgroundColor: '#e4e4e4',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
    marginRight: SPACING.sm,
  },
})

TagsDisplay.displayName = 'TagsDisplay'

export default memo(TagsDisplay)
