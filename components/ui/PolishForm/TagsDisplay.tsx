import {memo, forwardRef, useState, useCallback, useImperativeHandle} from "react";
import {PolishColumnRef} from "@/components/ui/PolishForm/types";
import {Tag} from "@/types/ui";
import {StyleSheet, View} from "react-native";
import {SPACING} from "@/constants/layout";
import {LINE_COLORS, THEME_COLORS} from "@/constants/Colors";
import {Flex} from "@/components/layout/Flex";
import {ThemeText} from "@/components/layout/ThemeText";
import DetailInput from "@/components/ui/DetailInput";
import {useRouter} from "expo-router";

type TagsDisplayProps = {
    values: Tag[]
}

const TagsDisplay = forwardRef<PolishColumnRef<Tag[]>, TagsDisplayProps>(( props, ref) => {
    const router = useRouter()
    const [tags, setTags] = useState<Tag[]>(props.values)

    const handleDetailInputPress = useCallback(() => {
        if(tags.length === 0) {
            router.navigate('/tags-select')
        } else {
            router.navigate({
                pathname: '/tags-select',
                params: {tagIds: JSON.stringify(tags.map(t => t.tagId))}
            })
        }
    }, [tags])

    useImperativeHandle(ref, () => ({
        getValue: () => tags,
        setValue: (tags) => setTags(tags)
    }))
    return (
        <View style={styles.container}>
            <DetailInput label={'標籤'} value={''} type={'select'} onSelectPress={handleDetailInputPress} />
            {tags.length ? (
                <View>
                    <Flex style={styles.tagsWrapper}>
                        {tags.map(tag =>
                            <View key={tag.tagId} style={styles.tag}>
                                <ThemeText>{tag.name}</ThemeText>
                            </View>
                        )}
                    </Flex>
                </View>
            ) : null}
        </View>
    )
})

const styles = StyleSheet.create({
    container: {},
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
    }
})

TagsDisplay.displayName = "TagsDisplay"

export default memo(TagsDisplay)