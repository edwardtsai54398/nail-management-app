import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import {Flex} from "@/components/layout/Flex";
import {ThemeText} from "@/components/layout/ThemeText";
import AntDesign from "@expo/vector-icons/AntDesign";
import {LINE_COLORS, THEME_COLORS} from "@/constants/Colors";
import {forwardRef, useCallback, useImperativeHandle, useState, memo, ReactNode} from "react";
import {SPACING} from "@/constants/layout";
import type {Brand} from "@/types/ui";

type SelectListProps<T> = {
    data: T[]
    noData?: ReactNode
    isSelected?: (item: T) => boolean
    renderItem: (item: T) => string
    onItemPress?: (item: T) => void
}


const SelectList = <T extends object | string>({data, noData, renderItem, isSelected, onItemPress}: SelectListProps<T>) => {
    const handlePress = useCallback((item: T) => {
        onItemPress && onItemPress(item)
    }, [onItemPress])

    return (
        <ScrollView>
            {
                data.length ?
                data.map((item, i) => (
                    <Pressable key={i} onPress={() => {handlePress(item)}}>
                        <Flex justify="between" style={styles.li}>
                            <ThemeText>{renderItem(item)}</ThemeText>
                            {
                                isSelected && isSelected(item) ? (
                                    <AntDesign name={'check'} size={20} style={{color: THEME_COLORS.primary}}/>
                                ) : null
                            }
                        </Flex>
                    </Pressable>
                )) :
                <Flex justify={'center'} style={{paddingVertical: SPACING.lg}}>
                    {noData || (<ThemeText size={'md'} color={'second'}>沒有資料</ThemeText>)}
                </Flex>
            }
        </ScrollView>
    )
}

SelectList.displayName = "SelectList"
export default memo(SelectList) as <T extends object | string>(props: SelectListProps<T>) => ReactNode

const styles = StyleSheet.create({
    li: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderColor: LINE_COLORS.default,

    }
})