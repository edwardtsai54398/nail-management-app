import { Col, Row, Flex } from "@/components/layout/Flex";
import { ThemeText } from "@/components/layout/ThemeText";
import PolishCard from "@/components/ui/PolishCard";
import {GRID_GAP, MOBILE_BAR_HEIGHT, SPACING} from "@/constants/layout";
import { Polish, SectionData } from "@/types/data";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, View } from 'react-native';
import {mockGetPolishItems} from "@/db/queries/polishItem";



function groupInRows<T>(data: T[], columnsPerRow: number): T[][]{
  const result: T[][] = []
  for(let i=0;i< data.length;i+=columnsPerRow){
    result.push(data.slice(i, i + columnsPerRow))
  }
  return result
}

export default function Index() {
  const [polishSectionData, setPolishData] = useState<SectionData>([])
  useEffect(() => {
    mockGetPolishItems().then((result) => {
      console.log(result)
      const seriesData = result.series
      const sectionData = seriesData.map((item, i) => ({
        ...item,
        data: groupInRows<Polish>(result.polishItems[i], 3)
      }))

      console.log(sectionData);

      setPolishData(sectionData)
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
