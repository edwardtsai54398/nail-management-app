import {Stack, useGlobalSearchParams, useRouter} from "expo-router";
import {useSeriesStore} from "@/store/series";
import {useCallback, useEffect, useRef, useState} from "react";
import {Series} from "@/types/ui";
import {ParamsToSeriesSelect} from "@/types/routes";
import SelectList, {SelectListRef} from "@/components/ui/SelectList";
import ThemeButton from "@/components/ui/ThemeButton";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SeriesSelect() {
    const router = useRouter();
    const params = useGlobalSearchParams<ParamsToSeriesSelect>()
    const selectListRef = useRef<SelectListRef>(null)
    const seriesMap = useSeriesStore(state => state.seriesMap)
    const [seriesList, setSeriesList] = useState<Series[]>([])

    useEffect(() => {
        if(!params.brandId) return
        // console.log('series-select got brandId', params)
        if(!seriesMap.has(params.brandId)){
            console.error(`brandId "${params.brandId}" is not exists`)
            router.back()
            return
        }
        setSeriesList(seriesMap.get(params.brandId)!)
    }, [seriesMap, params])

    useEffect(() => {
        if(!params.seriesId || !selectListRef.current) return
        // console.log('series-select got seriesId', params)
        selectListRef.current.setId(params.seriesId)
    }, [params, selectListRef])

    const handleGoBack = useCallback(() => {
        router.back()
        if(selectListRef.current) {
            const seriesId = selectListRef.current.getId()
            router.setParams({seriesId})
        }
    }, [])
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitleAlign: 'center',
                    headerTitle: '選擇系列',
                    headerLeft: (props) => <ThemeButton icon={<AntDesign name="left" size={16} />} label={'返回'} type="default" text onPress={handleGoBack} />,
                    headerRight: () => <ThemeButton label="完成" text />,
                    headerBackVisible: false
                }}
            />
            <SelectList ref={selectListRef} data={seriesList} uniqueKey={'seriesId'} displayKey={'seriesName'} />
        </>
    )
}