import {TouchableOpacity, View, StyleSheet, ViewProps} from "react-native";
import {ReactNode} from "react";
import {SPACING} from "@/constants/layout";
import {Flex} from "@/components/layout/Flex";
import {ThemeText} from "@/components/layout/ThemeText";
import {TEXT_COLORS, THEME_COLORS} from "@/constants/Colors";

type ButtonProps = {
    onPress?: () => void;
    label?: string;
    plain?: boolean;
    text?: boolean;
    icon?: ReactNode;
    iconAlign?: "left" | "right";
    type?: keyof typeof THEME_COLORS | 'default';
} & ViewProps

const styles = StyleSheet.create({
    button: {
        paddingVertical: SPACING.sm,
        borderRadius: 16,
        backgroundColor: THEME_COLORS.primary,
    },
    buttonText: {
        color: 'white'
    },
    isText: {
        backgroundColor: 'transparent',
    }
})

export  default function ThemeButton({onPress, label, plain, text, icon, iconAlign, type = 'primary'}: ButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
            <Flex direction={icon && iconAlign === 'right' ? 'row-reverse' : 'row'} style={[styles.button, (text ? styles.isText : null)]}>
                {icon ? (<View style={[(iconAlign === 'right' ? {marginLeft: SPACING.sm} : {marginRight: SPACING.sm})]}>{icon}</View>) : null}
                {label ? (
                    <ThemeText
                        style={[
                            styles.buttonText,
                            (text ? {color: type === 'default' ? TEXT_COLORS.default : THEME_COLORS[type]} : null)
                        ]}
                    >
                        {label}
                    </ThemeText>) :
                    null
                }
            </Flex>
        </TouchableOpacity>
    )
}