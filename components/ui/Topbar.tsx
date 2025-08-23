import {View, StyleSheet} from "react-native";
import {MOBILE_BAR_HEIGHT, SPACING} from "@/constants/layout";
import {LINE_COLORS} from "@/constants/Colors";
import {ReactNode} from "react";
import { BlurView } from 'expo-blur';
import {Flex} from "@/components/layout/Flex"

const styles = StyleSheet.create({
    container: {
        padding: SPACING.sm,
        paddingTop: MOBILE_BAR_HEIGHT,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 2000,
        borderBottomWidth: 1,
        borderBottomColor: LINE_COLORS.second,
    }
})

export default function Topbar({children, height = 48}: {children: ReactNode, height?: number}) {
    return (
        <BlurView style={styles.container} intensity={80} blurReductionFactor={50} experimentalBlurMethod="dimezisBlurView">
            <Flex style={{height}}>{children}</Flex>
        </BlurView>
    )
}