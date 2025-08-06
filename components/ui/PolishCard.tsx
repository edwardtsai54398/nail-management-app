import { SPACING } from "@/constants/layout";
import { Polish } from "@/types/data";
import { Image } from 'expo-image';
import { StyleSheet, View } from "react-native";
import { Flex } from "../layout/Flex";
import { ThemeText } from "../layout/ThemeText";


export default function({data}: {data: Polish}){
    return(
        <View style={styles.card}>
            <Image source={{uri: data.images[0].url}} contentFit="cover" style={styles.image}/>
            <ThemeText size="md" style={styles.poslishName}>{data.poslishName}</ThemeText>
            <Flex justify="end" style={styles.cardBottom}>
                {data.isFavorites ? (<ThemeText>V</ThemeText>) : null}
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
    poslishName: {
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
})