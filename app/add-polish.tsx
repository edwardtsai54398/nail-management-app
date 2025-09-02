import {Stack, useGlobalSearchParams, useLocalSearchParams, useNavigation} from "expo-router";
import {StyleSheet, ScrollView, View} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {ThemeText} from "@/components/layout/ThemeText";
import ThemeButton from "@/components/ui/ThemeButton";
import DetailInput from "@/components/ui/DetailInput";
import {SPACING} from "@/constants/layout";
import {LINE_COLORS} from "@/constants/Colors";
import {useRef, useState, useEffect} from "react";
import type {PolishFormValues, PolishFormRef, ParamsFromSelection} from "@/components/ui/PolishForm/types";
import PolishForm from "@/components/ui/PolishForm/PolishForm";




export default function AddPolish() {
    const navigation = useNavigation();
    const params = useGlobalSearchParams<ParamsFromSelection>()
    const initValues:PolishFormValues = {
        brandId: '',
        seriesId: ''
    }

    const formRef = useRef<PolishFormRef>(null)

    useEffect(() => {
        if(!formRef.current) return
        if(params.brandId) {
            // console.log('set brandId', params.brandId)
            formRef.current.setValue('brandId', params.brandId)
        }
        if(params.seriesId) {
            // console.log('set seriesId', params.seriesId)
            formRef.current.setValue('seriesId', params.seriesId)
        }
    }, [params]);
    return (
        <>
            <Stack.Screen
                options={{
                    presentation: 'modal',
                    headerTitleAlign: 'center',
                    headerTitle: '建立色膠',
                    headerLeft: (props) => <ThemeButton icon={<AntDesign name="close" size={26} />} type="default" text onPress={() => navigation.goBack()} />,
                    headerRight: () => <ThemeButton label="儲存" text />,
                    headerBackVisible: false
                }}
            />

            <ScrollView style={styles.container}>
                <PolishForm ref={formRef} initValues={initValues} />
                {/*<View style={styles.card}>*/}
                {/*    <DetailInput label="品牌" type="select" border="bottom" value={brand} />*/}
                {/*    <DetailInput label="系列" type="select" border="bottom" value={series} />*/}
                {/*    <DetailInput label="色號" type="input" border="bottom" value={colorName} onChangeValue={setColorName} placeholder="輸入色號" onFocus={() => {*/}
                {/*        console.log('onFocus')}} />*/}
                {/*</View>*/}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.md
    }
})