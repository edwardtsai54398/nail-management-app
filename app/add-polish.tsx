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
        seriesId: '',
        colorName: '',
        polishType: null
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

    const handleSaveClick = () => {
        if(!formRef.current) return
        const values = formRef.current.getValues()
        console.log('handleSaveClick')
        console.log(values)
    }
    return (
        <>
            <Stack.Screen
                options={{
                    presentation: 'modal',
                    headerTitleAlign: 'center',
                    headerTitle: '建立色膠',
                    headerLeft: (props) => <ThemeButton icon={<AntDesign name="close" size={26} />} type="default" text onPress={() => navigation.goBack()} />,
                    headerRight: () => <ThemeButton label="儲存" text onPress={handleSaveClick} />,
                    headerBackVisible: false
                }}
            />

            <ScrollView style={styles.container}>
                <PolishForm ref={formRef} initValues={initValues} />
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