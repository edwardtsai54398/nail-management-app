import { Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { useTagStore } from '@/store/tags'
import ThemeButton from '@/components/ui/ThemeButton'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useCallback, useEffect, useState } from 'react'
import { Tag } from '@/types/ui'
import SelectList from '@/components/ui/SelectList'
import { SPACING } from '@/constants/layout'
import { TextInput } from 'react-native'
import { uiStyles } from '@/assets/styles/ui'
import { Flex } from '@/components/layout/Flex'
import { useSQLiteContext } from 'expo-sqlite'
import { createTag, getTags } from '@/db/queries/tags'
import { ParamsToTagsSelect } from '@/types/routes'

export default function TagsSelect() {
  const router = useRouter()
  const params = useGlobalSearchParams<ParamsToTagsSelect>()
  const db = useSQLiteContext()
  const userTags = useTagStore((state) => state.data)
  const setAllTags = useTagStore((state) => state.setData)
  const addTag = useTagStore((state) => state.addTag)
  const [isAddMode, setIsAddMode] = useState(false)
  const [newTagText, setNewTagText] = useState<string>('')
  const [tagsSelected, setTagsSelected] = useState<Tag[]>([])

  useEffect(() => {
    if (userTags.length) return
    console.log('fetch tags')
    getTags(db).then((response) => {
      if (!response.success) return
      setAllTags(response.data)
    })
  }, [db, userTags, setAllTags])

  useEffect(() => {
    if (params.tagIds) {
      const tagIds = JSON.parse(params.tagIds) as string[]
      setTagsSelected(userTags.filter((tag) => tagIds.includes(tag.tagId)))
    }
  }, [params, userTags])

  const renderItem = useCallback((t: Tag) => t.name, [])
  const isSelected = useCallback(
    (t: Tag) => tagsSelected.some((tag) => tag.tagId === t.tagId),
    [tagsSelected],
  )
  const handleTagItemPress = useCallback(
    (tag: Tag) => {
      if (tagsSelected.some((t) => tag.tagId === t.tagId)) {
        setTagsSelected((prev) => prev.filter((t) => tag.tagId !== t.tagId))
      } else {
        setTagsSelected((prev) => [tag, ...prev])
      }
    },
    [tagsSelected],
  )

  const handleFinishPress = useCallback(async () => {
    try {
      const response = await createTag(db, newTagText)
      if (!response.success) {
        console.error(response.error)
        return
      }
      addTag(response.data)
      setTagsSelected((prev) => [...prev, response.data])
    } catch (e) {
      console.error('CREATE_TAG ERROR', e)
    } finally {
      setIsAddMode(false)
      setNewTagText('')
    }
  }, [newTagText, addTag, createTag])

  const handleGoBack = useCallback(() => {
    router.back()
    router.setParams({ tagIds: JSON.stringify(tagsSelected.map((t) => t.tagId)) })
  }, [router, tagsSelected])
  const handleCancelPress = useCallback(() => {
    setIsAddMode(false)
    setNewTagText('')
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          headerTitle: '選擇標籤',
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
            !isAddMode ? (
              <ThemeButton
                label="新增標籤"
                text
                onPress={() => {
                  setIsAddMode(true)
                }}
              />
            ) : (
              <ThemeButton label="取消" text onPress={handleCancelPress} />
            ),
          headerBackVisible: false,
        }}
      />
      {isAddMode ? (
        <Flex style={{ padding: SPACING.sm }}>
          <TextInput
            autoFocus={true}
            maxLength={25}
            numberOfLines={1}
            onChangeText={(val) => {
              setNewTagText(val)
            }}
            placeholder={'輸入新標籤名稱'}
            style={[uiStyles.input, { flexGrow: 1, marginRight: SPACING.sm }]}
          />
          <ThemeButton
            text
            label={'完成'}
            disabled={newTagText === ''}
            onPress={handleFinishPress}
          />
        </Flex>
      ) : null}
      <SelectList
        data={userTags}
        renderItem={renderItem}
        isSelected={isSelected}
        onItemPress={handleTagItemPress}
      />
    </>
  )
}
