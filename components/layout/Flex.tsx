import { BREAKPOINT, GRID_COLUMN, GRID_GAP } from "@/constants/layout";
import { ReactNode } from "react";
import { StyleSheet, useWindowDimensions, View, ViewProps, ViewStyle } from "react-native";



const flexStyles = StyleSheet.create({
    flexBox: {
        display: 'flex'
    },
})
export type FlexJustify = 'end' | 'between' | 'start' | 'center' | 'around'

export type FlexBoxProps = ViewProps & {
    align?: 'center' | 'end' | 'start'
    justify?: FlexJustify
    direction?: ViewStyle['flexDirection']
    children?: ReactNode
}


export function Flex({children, style, align = 'center', justify, direction = 'row'}: FlexBoxProps){
    const getAlignStyle = (val: FlexBoxProps['align']): ViewStyle['alignItems'] => {
        if(val === 'center') return 'center'
        if(val === 'end') return 'flex-end'
        return 'flex-start'
    }
    const getJustifyStyle = (val: FlexBoxProps['justify']): ViewStyle['justifyContent'] => {
        if(val === 'center') return 'center'
        if(val === 'between') return 'space-between'
        if(val === 'end') return 'flex-end'
        if(val === 'around') return 'space-around'
        return 'flex-start'
    }
    return (
        <View style={[flexStyles.flexBox,{alignItems: getAlignStyle(align), flexDirection: direction, justifyContent: getJustifyStyle(justify)}, style]}>
            {children}
        </View>
    )
}


export type RowProps = ViewProps & {
    children?: ReactNode,
}

export type ColProps = ViewProps & {
    children?: ReactNode
    base?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
}

const rowColumnStyle = StyleSheet.create({
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: GRID_GAP * -1,
        marginRight: GRID_GAP * -0.5,
        marginLeft: GRID_GAP * -0.5,
    },
    col: {
        // width: '100%',
        maxWidth: '100%',
        marginTop: GRID_GAP,
        paddingRight: GRID_GAP * 0.5,
        paddingLeft: GRID_GAP * 0.5
    }
})
export function Row({children, style}: RowProps){
    return (
        <View style={[rowColumnStyle.row, style]}>{children}</View>
    )
}

export function Col({children, style, base, sm, md, lg, xl, ...reset}: ColProps){
    const {width} = useWindowDimensions()
    const getColSpan = (): number | undefined => {
        if(width >= BREAKPOINT.xl && xl) return xl
        if(width >= BREAKPOINT.lg && lg) return lg
        if(width >= BREAKPOINT.md && md) return md
        if(width >= BREAKPOINT.sm && sm) return sm
        return base
    }
    const colSpan = getColSpan()

    const colWidth = colSpan ? `${(colSpan / GRID_COLUMN) * 100}%` as `${number}%` : undefined
    return (
        <View style={[style, rowColumnStyle.col, {flexGrow: colSpan ? 0 : 1}, (colSpan ? {width: colWidth} : undefined)]} {...reset}>
            {children}
        </View>
    )
}