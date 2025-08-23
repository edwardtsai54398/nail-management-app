import { Tabs } from "expo-router";

export default function TabsLayout() {
    return(
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, }} />
      <Tabs.Screen name="components" options={{ title: 'components', headerShown: false }} />
      <Tabs.Screen name="database" options={{ title: 'Database', headerShown: false }} />
    </Tabs>
  )
}