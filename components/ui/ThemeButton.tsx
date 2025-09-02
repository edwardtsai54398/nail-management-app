import {TouchableOpacity, View, StyleSheet, ViewProps, TouchableOpacityProps} from "react-native";
import {ReactNode, useCallback} from "react";
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
} & TouchableOpacityProps



export  default function ThemeButton({label, plain, text, icon, iconAlign = 'left', type = 'primary', disabled, ...rest}: ButtonProps) {
    const styles = StyleSheet.create({
        button: {
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.sm,
            borderRadius: 16,
            backgroundColor: (text || plain) ? 'transparent' : THEME_COLORS.primary,
            opacity: disabled ? 0.5 : 1,
        },
        buttonText: {
            color: (text || plain) ? ( type === 'default' ? TEXT_COLORS.default : THEME_COLORS[type]) : 'white'
        },
        iconWrapper: {
            marginLeft: iconAlign === 'right' ? SPACING.sm : 0,
            marginRight: iconAlign === 'left' ? SPACING.sm : 0,
            display: 'flex',
            alignItems: 'center',
        },
    })
    return (
        <TouchableOpacity activeOpacity={0.5} disabled={disabled} {...rest}>
            <Flex direction={icon && iconAlign === 'right' ? 'row-reverse' : 'row'} style={[styles.button]}>
                {icon ? (<View style={[styles.iconWrapper]}>{icon}</View>) : null}
                {label ? (
                    <ThemeText style={[styles.buttonText]}>
                        {label}
                    </ThemeText>) :
                    null
                }
            </Flex>
        </TouchableOpacity>
    )
}