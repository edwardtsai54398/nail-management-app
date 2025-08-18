import TopBar from "./TopBar";
import Drawer from "./Drawer";
import {Button, View, TouchableWithoutFeedback, StyleSheet, Animated, useAnimatedValue} from "react-native"
import {ReactNode, createContext,Dispatch,SetStateAction, useState, useContext, useEffect} from "react"
import {ThemeText} from "@/components/layout/ThemeText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {SPACING} from "@/constants/layout";
import {TEXT_COLORS, THEME_COLORS} from "@/constants/Colors";
import {AnimatedText} from "react-native-reanimated/lib/typescript/component/Text";

const styles = StyleSheet.create({
    filterButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: '100%',
        flex: 1
    },
})

type FilterOptionProps = {
    name: string
    label: string;
    renderLabel?: (label: string) => ReactNode;
    isLabelActive?: boolean
}

type FilterContextType = {
    options: FilterOptionProps[]
    setOptions: Dispatch<SetStateAction<FilterOptionProps[]>>
    drawerName: string
    setDrawerName: Dispatch<SetStateAction<string>>
    labelActive: string[]
    setLabelActive: Dispatch<SetStateAction<string[]>>
}

const FiltersContext = createContext<FilterContextType | null>(null);

export default function TopFilters({children, height}: {children: ReactNode; height?: number}) {
    const [options, setOptions] = useState<FilterOptionProps[]>([])
    const [drawerName, setDrawerName] = useState<string>('')
    const [labelActive, setLabelActive] = useState<string[]>([])

    const value = {
        options,
        setOptions,
        drawerName,
        setDrawerName,
        labelActive,
        setLabelActive,
    }

    return (
        <FiltersContext.Provider value={value}>
            <TopBar justify="around" height={height}>
                {options.map((opt, i) => (
                    <FilterLabel
                        key={i}
                        label={!opt.renderLabel ? opt.label : opt.renderLabel(opt.label)}
                        isTextActive={labelActive.includes(opt.name) || opt.name === drawerName}
                        isDrawerActive={opt.name === drawerName}
                        onPress={() => {
                            setDrawerName(opt.name === drawerName ? '' : opt.name)
                        }}
                    />

                ))}
            </TopBar>
            {children}
        </FiltersContext.Provider>
    )
}

function FilterLabel({label, isTextActive, isDrawerActive, onPress}: {label: string | ReactNode; isTextActive: boolean; isDrawerActive: boolean; onPress: () => void}) {
    const colorAnim = useAnimatedValue(isTextActive ? 1 : 0)
    const rotateAnim = useAnimatedValue(isDrawerActive ? 1 : 0)

    useEffect(() => {
        Animated.timing(colorAnim, {
            toValue: isTextActive ? 1 : 0,
            duration: 200,
            useNativeDriver: false, // 顏色不能用 native driver
        }).start();

        Animated.timing(rotateAnim, {
            toValue: isDrawerActive ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isTextActive]);
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isDrawerActive ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isDrawerActive]);

    const textColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [TEXT_COLORS.default, THEME_COLORS.primary],
    });
    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.filterButton]}>
                <ThemeText style={{color: textColor as any}}>{label}</ThemeText>
                <Animated.View style={{marginLeft: SPACING.sm, transform: [{ rotate }]}}>
                    <ThemeText style={{color: textColor as any}} >
                        <FontAwesome name="caret-down" />
                    </ThemeText>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    )
}

type OptionComponentProps = {
    children?: ReactNode
    onConfirm: () => void
} & FilterOptionProps
function Option({children, onConfirm, label, renderLabel, name, isLabelActive}: OptionComponentProps) {
    const context = useContext(FiltersContext);
    const [drawerShow, setDrawerShow] = useState<boolean>(false);
    useEffect(() => {
        if(!context) return;
        if(context.options.length > 0) return
        context.setOptions((prev) => [...prev, {label, renderLabel, name}])
    }, [label]);
    useEffect(() => {
        if(!context) return;
        setDrawerShow(context.drawerName === name)

    }, [context?.drawerName]);
    useEffect(() => {
        if(!context) return;
        console.log(name, isLabelActive)
        if(isLabelActive && !context.labelActive.find(label => label === name)) {
            context.setLabelActive(prev => [...prev, name]);

        } else if(!isLabelActive && context.labelActive.find(label => label === name)) {
            context.setLabelActive(prev => prev.filter(label => label !== name));
        }
        console.log(context.labelActive)
    }, [isLabelActive]);

    if(!context) return null;

    return (
        // <></>
        <Drawer
            show={drawerShow}
            onClose={() => {
                setDrawerShow(false);
                context.setDrawerName('')
            }}
            footer={(
                <Button title={"Confirm"} onPress={onConfirm}></Button>
            )}
        >
            <View style={{paddingTop: 48}}>
                {children}
            </View>
        </Drawer>
    )
}

TopFilters.Option = Option