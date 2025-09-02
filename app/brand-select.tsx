import {Stack, useGlobalSearchParams, useRouter} from "expo-router";
import ThemeButton from "@/components/ui/ThemeButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {SPACING} from "@/constants/layout";
import {LINE_COLORS} from "@/constants/Colors";
import {useBrandStore} from "@/store/brands";
import {Flex} from "@/components/layout/Flex";
import SelectList, {SelectListRef} from "@/components/ui/SelectList";
import {ParamsToBrandSelect} from "@/types/routes";
import {uiStyles} from "@/assets/styles/ui";
import {addBrand} from "@/db/queries/brand";
import {useSeriesStore} from "@/store/series";
import {Series} from "@/types/ui";

export default function BrandSelect() {
    const router = useRouter();
    const params = useGlobalSearchParams<ParamsToBrandSelect>()
    const selectListRef = useRef<SelectListRef>(null)
    const brands = useBrandStore(state => state.data)
    const setBrands = useBrandStore(state => state.setData)
    const addSeries = useSeriesStore(state => state.addData)
    const brandIdSelected = useRef<string>('');
    const [isAddBrandMode, setIsAddBrandMode] = useState(false);
    const [addBrandText, setAddBrandText] = useState<string>('');

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

    const handleCancelPress = () => {
        setIsAddBrandMode(false);
        setAddBrandText('')
    }

    const handleFinishPress = async () => {
        console.log('handleFinishPress')
        try {
            const response = await addBrand(addBrandText)
            if(!response.success) return
            const brand = response.data
            setBrands([brand, ...brands])
            addSeries(brand.brandId, [])
            if(selectListRef.current) {
                selectListRef.current.setId(response.data.brandId)
            }
            setIsAddBrandMode(false);
            setAddBrandText('')
        } catch (e) {
            console.error('CREATE BRAND ERROR:')
            console.error(e)
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitleAlign: 'center',
                    headerTitle: '選擇品牌',
                    headerLeft: (props) => <ThemeButton icon={<AntDesign name="left" size={16} />} label={'返回'} type="default" text onPress={handleGoBack} />,
                    headerRight: () => (!isAddBrandMode ? <ThemeButton label="新增品牌" text onPress={() => {setIsAddBrandMode(true)}} /> : <ThemeButton label="取消" text onPress={handleCancelPress} />),
                    headerBackVisible: false
                }}
            />
            {isAddBrandMode ? (
                <Flex style={{padding: SPACING.sm}}>
                    <TextInput
                        autoFocus={true}
                        maxLength={25}
                        numberOfLines={1}
                        onChangeText={(val) => {setAddBrandText(val)}}
                        placeholder={'輸入新品牌名稱'}
                        style={[uiStyles.input, {flexGrow: 1, marginRight: SPACING.sm}]}
                    />
                    <ThemeButton text label={'完成'} disabled={(addBrandText === '')} onPress={handleFinishPress} />
                </Flex>
            ) : null}
            <SelectList ref={selectListRef} data={brands} uniqueKey={'brandId'} displayKey={'brandName'}/>
        </>
    )
}
