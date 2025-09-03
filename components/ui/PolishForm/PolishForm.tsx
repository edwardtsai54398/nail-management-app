import {forwardRef, memo, useCallback, useImperativeHandle, useRef} from "react"
import DetailInput from "@/components/ui/DetailInput";
import {StyleSheet, View} from "react-native";
import {SPACING} from "@/constants/layout";
import {LINE_COLORS} from "@/constants/Colors";
import BrandInput from "./BrandInput";
import type {PolishColumnRef, PolishFormValues, PolishFormRef} from "./types";
import SeriesInput from "@/components/ui/PolishForm/SeriesInput";
import ColorNameInput from "@/components/ui/PolishForm/ColorNameInput";
import PolishTypesSelector from "@/components/ui/PolishForm/PolishTypesSelector";
import {PolishType} from "@/types/ui";
import ColorSelector from "@/components/ui/PolishForm/ColorSelector";
import {Row, Col} from "@/components/layout/Flex";
import StockCounter from "@/components/ui/PolishForm/StockCounter";
import Favorites from "@/components/ui/PolishForm/Favorite";



type PolishFormProps = {
    initValues: PolishFormValues
}

const PolishForm = forwardRef<PolishFormRef, PolishFormProps>((
    {initValues},
    ref
) => {
    const initValRef = useRef(initValues)
    const brandIdRef = useRef('')
    const brandRef = useRef<PolishColumnRef<string>>(null)
    const seriesRef = useRef<PolishColumnRef<string>>(null)
    const coloNameRef = useRef<PolishColumnRef<string>>(null)
    const polishTypesRef = useRef<PolishColumnRef<PolishType | null>>(null)
    const colorSelectorRef = useRef<PolishColumnRef<string[]>>(null)
    const stockRef = useRef<PolishColumnRef<number>>(null)
    const favoritesRef = useRef<PolishColumnRef<boolean>>(null)

    const handleBrandInputChange = useCallback((brandId: string) => {
        // console.log('BrandInput Change', brandId)
        brandIdRef.current = brandId
    }, [brandIdRef])


    useImperativeHandle(ref, () => ({
        getValues: () => ({
            brandId: brandRef.current?.getValue() || '',
            seriesId: seriesRef.current?.getValue() || '',
            colorName: coloNameRef.current?.getValue() || '',
            polishType: polishTypesRef.current?.getValue() || null,
            colors: colorSelectorRef.current?.getValue() || [],
            stock: stockRef.current?.getValue() || 0,
            isFavorites: favoritesRef.current?.getValue() || false
        }),
        setValue: (key, val) => {
            switch (key) {
                case "brandId":
                    brandRef.current?.setValue(val as string)
                    break
                case 'seriesId':
                    seriesRef.current?.setValue(val as string)
                    break
                case 'colorName':
                    coloNameRef.current?.setValue(val as string)
                    break
                case 'polishType':
                    polishTypesRef.current?.setValue(val as PolishType)
                    break
            }
        }
    }))

    return (
        <View style={styles.card}>
            <BrandInput ref={brandRef} val={initValRef.current.brandId} onChange={handleBrandInputChange} />
            <SeriesInput ref={seriesRef} val={initValRef.current.seriesId} brandId={brandIdRef.current} />
            <ColorNameInput ref={coloNameRef} val={initValRef.current.colorName} />
            <PolishTypesSelector ref={polishTypesRef} val={initValRef.current.polishType}/>
            <ColorSelector ref={colorSelectorRef} values={initValRef.current.colors}/>
            <View style={styles.stockFavoriteWrapper}>
                <Row>
                    <Col base={7} style={styles.stockWrapper}>
                        <StockCounter ref={stockRef} val={initValRef.current.stock}/>
                    </Col>
                    <Col base={5}>
                        <Favorites ref={favoritesRef} val={initValRef.current.isFavorites}/>
                    </Col>
                </Row>
            </View>
        </View>
    )
})


const styles = StyleSheet.create({
    card: {
        borderRadius: SPACING.lg,
        borderColor: LINE_COLORS.second,
        paddingHorizontal: SPACING.md,
        paddingTop: 0,
        paddingBottom: SPACING.md,
        backgroundColor: 'white'
    },
    stockFavoriteWrapper: {
        borderBottomWidth: 1,
        borderColor: LINE_COLORS.second,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.md
    },
    stockWrapper: {
        borderRightWidth: 1,
        borderColor: LINE_COLORS.second,
    }
})

PolishForm.displayName = 'PolishForm'
export default PolishForm