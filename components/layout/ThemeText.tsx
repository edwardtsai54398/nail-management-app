import { TEXT_COLORS, THEME_COLORS } from '@/constants/colors';
import { FONT_SIZES } from '@/constants/layout';
import { ReactNode } from "react";
import { StyleSheet, Text, type TextProps } from 'react-native';

type TextColorsKeys = keyof typeof TEXT_COLORS
type ThemeColorsKeys = keyof typeof THEME_COLORS
type FontSizeKeys = keyof typeof FONT_SIZES

export type ThemeTextProps = TextProps & {
  color?: TextColorsKeys | ThemeColorsKeys
  type?: 'default' | 'title' | 'subtitle' | 'link';
  size?: FontSizeKeys
    children: ReactNode
};


export function ThemeText({
  style,
    color = 'default',
  type = 'default',
  size,
  children,
  ...reset
}: ThemeTextProps) {

    const getTextColor = (key: ThemeTextProps['color'] = 'default') => {
        if(key in TEXT_COLORS){
            return TEXT_COLORS[key as TextColorsKeys]
        }
        if(key in THEME_COLORS){
            return THEME_COLORS[key as ThemeColorsKeys]
        }
    }
  return (
    <Text
      style={[
        { color: getTextColor(color) },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        size ? {fontSize: FONT_SIZES[size]} : undefined,
        style,
      ]}
      {...reset}
    >{children}</Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 24,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: FONT_SIZES.sm,
    color: TEXT_COLORS.link
  },
});