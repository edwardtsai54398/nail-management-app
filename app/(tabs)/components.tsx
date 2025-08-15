import {Button, View} from "react-native"
import {useState} from "react";
import TopDrawer from "@/components/ui/TopDrawer"
import {MOBILE_BAR_HEIGHT} from "@/constants/layout";
import {ThemeText} from "@/components/layout/ThemeText";
import Topbar from "@/components/ui/Topbar";


export default function Components(){
    const [isOpen, setIsOpen] = useState(false)
    return(
        <View style={{paddingTop: MOBILE_BAR_HEIGHT}}>
            {/*<Topbar><ThemeText>Content</ThemeText></Topbar>*/}
            <Button onPress={() => {setIsOpen(true)}} title="Open"></Button>
            <TopDrawer show={isOpen} direction="b-t" onClose={() => setIsOpen(false)} footer={(<Button onPress={() => {setIsOpen(false)}} title="Close"></Button>)}>
                <ThemeText>Content</ThemeText>
            </TopDrawer>
        </View>
    )
}