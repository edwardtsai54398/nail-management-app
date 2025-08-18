import {Button, View} from "react-native"
import {useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ThemeText} from "@/components/layout/ThemeText";
import TopFilters from "@/components/ui/TopFilters";


export default function Components(){
    const [isOpen, setIsOpen] = useState(false)
    const topBarHeight = 50
    return(
        <View style={{paddingTop: useSafeAreaInsets().top + topBarHeight}}>
            <TopFilters height={topBarHeight}>
                <TopFilters.Option name="brands" label={"Brands"} isLabelActive={isOpen} onConfirm={() => {
                    console.log("onConfirm Brands");}}>
                        <ThemeText>brands</ThemeText>
                </TopFilters.Option>
                <TopFilters.Option name="polishTypes" label={"Polish Types"} onConfirm={() => {
                    console.log("onConfirm polishTypes");}}>
                    <ThemeText>Polish Types</ThemeText>
                </TopFilters.Option>
            </TopFilters>
            <Button title="Open" onPress={() => setIsOpen(!isOpen)}></Button>
            {/*<Drawer show={isOpen} onClose={() => {setIsOpen(false)}} footer={(<Button title="Close" onPress={() => setIsOpen(false)}></Button>)}>*/}
            {/*    <View style={{backgroundColor: 'red', height: '100%'}}></View>*/}
            {/*</Drawer>*/}
        </View>
    )
}