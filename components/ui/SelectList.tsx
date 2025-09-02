import {Pressable, ScrollView, StyleSheet, View} from "react-native";
import {Flex} from "@/components/layout/Flex";
import {ThemeText} from "@/components/layout/ThemeText";
import AntDesign from "@expo/vector-icons/AntDesign";
import {LINE_COLORS, THEME_COLORS} from "@/constants/Colors";
import {forwardRef, useCallback, useImperativeHandle, useState, memo, ReactNode} from "react";
import {SPACING} from "@/constants/layout";
import type {Brand} from "@/types/ui";

type SelectListProps = {
    data: Record<string, string>[]
    uniqueKey: string
    displayKey: string
    onChange?: (value: string) => void
    noData?: ReactNode
}

export type SelectListRef = {
    getId: () => string
    setId: (id: string) => void
}

const SelectList = forwardRef<SelectListRef, SelectListProps>((
    {data, uniqueKey, displayKey, onChange, noData},
    ref
) => {
    const [idSelected, setIdSelected] = useState<string>('');
    const handlePress = useCallback((item: any) => {
        setIdSelected(item[uniqueKey])
        onChange && onChange(item[uniqueKey])
    }, [onChange, uniqueKey])

    useImperativeHandle(ref, () => ({
        getId: () => idSelected,
        setId: (val) => {setIdSelected(val)}
    }))
    return (
        <ScrollView>
            {
                data.length ?
                data.map((item) => (
                    <Pressable key={item[uniqueKey]} onPress={() => {handlePress(item)}}>
                        <Flex justify="between" style={styles.li}>
                            <ThemeText>{item[displayKey]}</ThemeText>
                            {
                                idSelected === item[uniqueKey] ? (
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
})

SelectList.displayName = "SelectList"
export default memo(SelectList)

const styles = StyleSheet.create({
    li: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderColor: LINE_COLORS.default,

    }
})