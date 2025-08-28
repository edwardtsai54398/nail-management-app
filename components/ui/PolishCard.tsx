import { SPACING } from "@/constants/layout";
import { Polish } from "@/types/data";
import { Image } from 'expo-image';
import { StyleSheet, View } from "react-native";
import { Flex } from "../layout/Flex";
import { ThemeText } from "../layout/ThemeText";


export default function PolishCard({data}: {data: Polish}){
    return(
        <View style={styles.card}>
            <View style={{position: 'relative'}}>
                <Image source={{uri: data.images[0]?.url}} contentFit="cover" style={styles.image}/>
                <View style={styles.favoriteWrapper}>
                    {data.isFavorites ? (<ThemeText>V</ThemeText>) : null}
                </View>
            </View>
            <Flex style={styles.polishName} direction="column" align="center">
                <ThemeText>{data.polishName}</ThemeText>
                <ThemeText size="xxs" color="second">{ data.polishType?.name || '' }</ThemeText>
            </Flex>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        // borderWidth: 1,
        // borderColor: 'red'
    },
    polishName: {
        marginTop: SPACING.xs,
        paddingHorizontal: SPACING.sm
    },
    image: {
        aspectRatio: '1/1',
        borderRadius: 10,
        overflow: 'hidden',
    },
    cardBottom: {
        marginTop: SPACING.sm * -1,
        paddingHorizontal: SPACING.sm,
        height: 24
    },
    favoriteWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: SPACING.xs
    }
})