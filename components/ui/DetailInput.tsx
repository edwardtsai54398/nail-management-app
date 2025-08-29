import {Flex} from "@/components/layout/Flex";
import {ThemeText} from "@/components/layout/ThemeText";
import {Pressable, StyleSheet, TextInput, View} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {SPACING} from "@/constants/layout";
import {LINE_COLORS} from "@/constants/Colors";
import {useRef, memo} from "react";

type BaseProps = {
    label: string
    value: string
    border?: 'top' | 'bottom'
    placeholder?: string
}

type SelectInputProps = BaseProps & {
    type: 'select'
    onSelectPress?: () => void
    onFocus?: never
    onChangeValue?: never
}

type TextInputProps = BaseProps & {
    type: 'input'
    onFocus?: () => void
    onChangeValue?: (text: string) => void
    onSelectPress?: never
}

type DetailInputProps = SelectInputProps | TextInputProps

const DetailInput = memo(({value, label, type = 'select', onSelectPress, onFocus, border, onChangeValue, placeholder}: DetailInputProps) => {
    const inputRef = useRef<TextInput | null>(null)
    const handlePress = () => {
        if(type === 'select' && onSelectPress) {
            onSelectPress()
        } else if(type === 'input' && inputRef.current) {
            inputRef.current.focus()
        }
    }
    return (
        <Pressable onPress={handlePress}>
            <Flex justify="between" style={[styles.container, (border === 'top' ? styles.borderTop : (border === 'bottom' ? styles.borderBottom : null))]}>
                <ThemeText>{label}</ThemeText>
                {
                    type === 'select' ? (
                        <Flex>
                            {value ? <ThemeText>{value}</ThemeText> : <ThemeText color="subtle">{placeholder}</ThemeText>}
                            <AntDesign name="right" size={20} style={{marginLeft: SPACING.sm}} />
                        </Flex>
                    ) : (
                        <TextInput
                            ref={inputRef}
                            onFocus={onFocus}
                            value={value}
                            onChangeText={onChangeValue}
                            inputMode="text"
                            placeholder={placeholder}
                            style={styles.input}
                        />
                    )
                }

            </Flex>
        </Pressable>
    )
})


const styles = StyleSheet.create({
    container: {
        height: 50,
        paddingRight: SPACING.sm,
        paddingLeft: SPACING.md
    },
    borderTop: {
        borderTopWidth: 1,
        borderColor: LINE_COLORS.default
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: LINE_COLORS.default
    },
    input: {
        paddingRight: SPACING.xl
    }
})

DetailInput.displayName = 'DetailInput'
export default DetailInput