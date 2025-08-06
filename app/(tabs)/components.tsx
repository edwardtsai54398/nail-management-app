import { Col, Flex, Row } from '@/components/layout/Flex';
import { ThemeText } from '@/components/layout/ThemeText';
import PolishCard from '@/components/ui/PolishCard';
import { SPACING } from '@/constants/layout';
import { StyleSheet, Text, View } from 'react-native';


const styles = StyleSheet.create({
    box: {
        borderColor: 'red',
        borderWidth: 2
    }
})

export default function Components(){
    const polishData = {
        polishId: '3',
        poslishName: 'beige',
        isFavorites: false,
        stock: 1,
        brandName: 'Cleto',
        seriesName: 'Basic Mag',
        color: 'beige',
        images: [{url: 'https://baseec-img-mng.akamaized.net/images/item/origin/216b7ebf087767efa4afe05337448956.png?imformat=generic'}]
      }
    return(
        <>
        <Flex justify="between" style={{padding: SPACING.sm}}>
            <ThemeText type="title">left</ThemeText>
            <ThemeText type="subtitle">right</ThemeText>
        </Flex>
        <Flex justify="end">
            <Text>left</Text>
            <Text>right</Text>
        </Flex>
        <Row>
            {[...Array(10)].map((n, i) => (
                <Col base={4} key={i}>
                    <View style={styles.box}>
                        <Text>{i}</Text>
                    </View>
                </Col>
            ))}
        </Row>
        <PolishCard data={polishData}></PolishCard>
        </>
    )
}