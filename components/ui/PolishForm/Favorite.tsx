import {memo, forwardRef, useState, useImperativeHandle} from "react";
import {PolishColumnRef} from "@/components/ui/PolishForm/types";
import {Flex} from '@/components/layout/Flex'
import {ThemeText} from "@/components/layout/ThemeText";
import Entypo from "@expo/vector-icons/Entypo";
import {TEXT_COLORS} from "@/constants/Colors";
import ThemeButton from "@/components/ui/ThemeButton";
import {SPACING} from "@/constants/layout";

type FavoriteProps = {
    val: boolean
}

const Favorite = forwardRef<PolishColumnRef<boolean>, FavoriteProps>((props, ref) => {
    const [isFavorites, setIsFavorites] = useState<boolean>(props.val)
    useImperativeHandle(ref, () => ({
        getValue: () => isFavorites,
        setValue: (val) => setIsFavorites(val)
    }))
    return (
        <Flex justify={'between'} style={{paddingLeft: SPACING.xs}}>
            <ThemeText>最愛</ThemeText>
            <ThemeButton
                type={'default'}
                text
                icon={
                    <Entypo
                        size={20}
                        name={isFavorites ? 'heart' : 'heart-outlined'}
                        style={{color: isFavorites? '#fac' : TEXT_COLORS.default}}
                    />
                }
                onPress={() => {setIsFavorites(!isFavorites)}}>
            </ThemeButton>
        </Flex>
    )
})


Favorite.displayName = 'Favorite'
export default memo(Favorite)