import {Modal, View, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback, useAnimatedValue} from 'react-native'
import {ThemeText} from "@/components/layout/ThemeText";
import {ReactNode, useEffect, useState} from "react";
import {SPACING} from "@/constants/layout";

interface DrawerProps {
    show: boolean
    children: ReactNode
    drawerHeight?: number
    onClose: () => void
    footer?: ReactNode
    direction?: 't-b' | 'b-t'
}


const styles = StyleSheet.create({
    overlay: {
        height: '100%',
        backgroundColor: 'rgba(144,144,144,0.5)'
    },
    drawerContainer: {
        position: 'absolute',
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    topDrawer: {
        top: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    bottomDrawer: {
        bottom: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    body: {
      flex: 1
    },
    footer: {
        padding: SPACING.md,
    }
})

export default function TopDrawer({show, onClose, children, drawerHeight = 300, footer, direction = 't-b'}: DrawerProps) {
    const [modelVisible, setModelVisible] = useState<boolean>(false)
    const translateY = useAnimatedValue(drawerHeight * (direction === 't-b' ? -1 : 1))
    const duration = 250

    useEffect(() => {
        if(show){
            setModelVisible(show)
            setTimeout(() => {
                slideIn()

            }, 100)
        } else {
            slideOut()
        }
    }, [show]);

    const slideIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        console.log('slideIn')
        Animated.timing(translateY, {
            toValue: 0,
            duration,
            useNativeDriver: true,
        }).start();
    };

    const slideOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        console.log('slideOut')
        Animated.timing(translateY, {
            toValue: drawerHeight * (direction === 't-b' ? -1 : 1),
            duration,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                setModelVisible(false)
            }, 100)
        })
    };
    return(
        <Modal transparent visible={modelVisible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}></View>
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.drawerContainer, (direction === 't-b' ? styles.topDrawer : styles.bottomDrawer), {translateY: translateY, height: drawerHeight}]}>
                <ScrollView style={styles.body}>{children}</ScrollView>
                {footer ? (
                    <View style={styles.footer}>{footer}</View>
                ) : null}
            </Animated.View>
        </Modal>
    )
}

