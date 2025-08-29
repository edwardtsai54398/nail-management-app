import {Stack, useGlobalSearchParams, useRouter} from "expo-router";
import ThemeButton from "@/components/ui/ThemeButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useCallback, useEffect, useRef, useState} from "react";
import type {Brand} from "@/types/ui";
import { StyleSheet} from "react-native";
import {SPACING} from "@/constants/layout";
import {LINE_COLORS} from "@/constants/Colors";
import {useBrandStore} from "@/store/brands";
import SelectList, {SelectListRef} from "@/components/ui/SelectList";
import {ParamsToBrandSelect} from "@/types/routes";

export default function BrandSelect() {
    const router = useRouter();
    const params = useGlobalSearchParams<ParamsToBrandSelect>()
    const selectListRef = useRef<SelectListRef>(null)
    const brands = useBrandStore(state => state.data)
    const brandIdSelected = useRef<string>('');

    useEffect(() => {
        if(!params.brandId || !brands.some(b => b.brandId === params.brandId)) return
        brandIdSelected.current = params.brandId
        if(selectListRef.current) {
            selectListRef.current.setId(params.brandId)
        }
    }, [params, selectListRef])



    const handleGoBack = useCallback(() => {
        router.back()
        if(selectListRef.current) {
            const brandId = selectListRef.current.getId()
            router.setParams({brandId})
        }
    }, [brandIdSelected])
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitleAlign: 'center',
                    headerTitle: '選擇品牌',
                    headerLeft: (props) => <ThemeButton icon={<AntDesign name="left" size={16} />} label={'返回'} type="default" text onPress={handleGoBack} />,
                    headerRight: () => <ThemeButton label="完成" text />,
                    headerBackVisible: false
                }}
            />
            <SelectList ref={selectListRef} data={brands} uniqueKey={'brandId'} displayKey={'brandName'}/>
        </>
    )
}

const styles = StyleSheet.create({
    li: {
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderColor: LINE_COLORS.default,

    }
})