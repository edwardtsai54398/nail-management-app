import {Animated, TouchableWithoutFeedback, StyleSheet,View, useAnimatedValue} from "react-native";
import {createContext, ReactNode, useState, useEffect} from "react";

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        zIndex: 2000,
        height: '100%',
        width: '100%',
    },
    overlay: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(144,144,144,0.5)',
    },
})
export type OverlayContextType = {
    register: () => void
    unregister: () => void
    drawerOpenCount: number
}
export const OverlayContext = createContext<OverlayContextType>({
    register: () => {},
    unregister: () => {},
    drawerOpenCount: 0
})

export default function OverlayProvider({children}: {children: ReactNode}) {
    const [drawerOpenCount, setDrawerOpenCount] = useState<number>(0)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const opacity = useAnimatedValue(0)
    const duration = 250

    const register = () => {setDrawerOpenCount(c => c + 1)}
    const unregister = () => {setDrawerOpenCount(c => Math.max(0, c - 1))}
    const onClickOverlay = () => {
        setDrawerOpenCount(0)
    }
    const showOverlay = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        }).start()
    }
    const hideOverlay = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                setModalVisible(false)
            }, 100)

        });
    }
    useEffect(() => {
        if(drawerOpenCount > 0){
            setModalVisible(true)
            showOverlay()
        } else {
            hideOverlay()
        }
    }, [drawerOpenCount]);
    return (
        <OverlayContext.Provider value={{register, unregister, drawerOpenCount}}>
            <View style={[styles.overlayContainer, {display: modalVisible ? 'contents' : 'none'}]}>
            <TouchableWithoutFeedback onPress={onClickOverlay}>
                <Animated.View style={[styles.overlay, {opacity: opacity}]}></Animated.View>
            </TouchableWithoutFeedback>

            </View>
            {children}
        </OverlayContext.Provider>
    )
}