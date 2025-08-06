import { Col, Row } from "@/components/layout/Flex";
import { ThemeText } from "@/components/layout/ThemeText";
import PolishCard from "@/components/ui/PolishCard";
import { GRID_GAP, SPACING } from "@/constants/layout";
import { Polish, SectionData } from "@/types/data";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, View } from 'react-native';

const data = [
  {
    title: 'Basic Mag',
    data: [
      {
        polishId: '1',
        poslishName: 'black',
        isFavorites: true,
        stock: 1,
        brandName: 'Cleto',
        seriesName: 'Basic Mag',
        color: 'black',
        images: [{url:'https://baseec-img-mng.akamaized.net/images/item/origin/d7a6976fa192ce8ef274b8090d5ed415.png?imformat=generic'}]
      },
      {
        polishId: '2',
        poslishName: 'white',
        isFavorites: false,
        stock: 1,
        brandName: 'Cleto',
        seriesName: 'Basic Mag',
        color: 'white',
        images: [{url:'https://baseec-img-mng.akamaized.net/images/item/origin/216b7ebf087767efa4afe05337448956.png?imformat=generic'}]
      },
      {
        polishId: '3',
        poslishName: 'beige',
        isFavorites: false,
        stock: 1,
        brandName: 'Cleto',
        seriesName: 'Basic Mag',
        color: 'beige',
        images: [{url: 'https://baseec-img-mng.akamaized.net/images/item/origin/4c0bdfaa86584b27cd8ae73676dfbc7e.png?imformat=generic'}]
      },
    ]
  }
]

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
    const newData = data
    const polishList = data[0].data
    const dataLength = 20
    let id = polishList.length
    while(newData[0].data.length < dataLength){
      const index = Math.floor(Math.random() * polishList.length)
      id += 1
      newData[0].data.push({
        ...polishList[index],
        polishId: `${id}`,
      })
    }
    newData.push({
      title: 'HOHO ME',
      data: newData[0].data
    })
    const sectionData = newData.map(item => ({
      ...item,
      data: groupInRows<Polish>(item.data, 3)
    }))
    console.log(sectionData);
    
    setPolishData(sectionData)
  }, [])
  

  return (
    <View style={styles.container}>
      <SectionList
        sections={polishSectionData}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeader}>
            <ThemeText type="subtitle">{section.title}</ThemeText>
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
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg
  },
  row: {
    width: '100%',
    marginTop: GRID_GAP, 
  },
  sectionHeader: {
    paddingVertical: SPACING.md,
    backgroundColor: 'rgb(242, 242, 242)'
  }
});
