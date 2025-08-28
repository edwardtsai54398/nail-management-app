import { Col, Flex, Row } from "@/components/layout/Flex";
import { ThemeText } from "@/components/layout/ThemeText";
import PolishCard from "@/components/ui/PolishCard";
import { GRID_GAP, MOBILE_BAR_HEIGHT, SPACING } from "@/constants/layout";
import usePolishApi from "@/db/queries/polishItem";
import type { SectionData, Polish } from "@/types/data";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, View } from 'react-native';




function groupInRows<T>(data: T[], columnsPerRow: number): T[][]{
  const result: T[][] = []
  for(let i=0;i< data.length;i+=columnsPerRow){
    result.push(data.slice(i, i + columnsPerRow))
  }
  return result
}

export default function Index() {
  const [polishSectionData, setPolishData] = useState<SectionData>([])
  const db = useSQLiteContext();
  const {getPolishList} = usePolishApi(db)
  useEffect(() => {

    getPolishList().then((result) => {
      // console.log(result);
      if(result.success){
        
        const sectionData = result.data.series.map((s, i) => ({
          ...s,
          data: groupInRows<Polish>(result.data.polishItems[i], 3)
        }))
        setPolishData(sectionData)
      }
    })
  }, [])
  

  return (
    <View style={styles.container}>
      <SectionList
        sections={polishSectionData}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeader}>
            <Flex justify="between">
              <ThemeText type="subtitle">{section.brandName}</ThemeText>
              <ThemeText color="second">{section.seriesName}</ThemeText>
            </Flex>
          </View>
        )}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Row>
              {item.map(col => (
                <Col key={col.polishId} base={4}>
                  <PolishCard data={col}></PolishCard>
                </Col>
              ))}
            </Row>
          </View>
        )}
      ></SectionList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: MOBILE_BAR_HEIGHT,
    paddingHorizontal: SPACING.lg
  },
  row: {
    width: '100%',
    marginTop: GRID_GAP, 
  },
  sectionHeader: {
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgb(242, 242, 242)'
  }
});
