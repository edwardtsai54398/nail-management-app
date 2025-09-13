import { ThemeText } from '@/components/layout/ThemeText'
import { runMigrations } from '@/db/migrations'
import { Stack } from 'expo-router'
import { Suspense } from 'react'
import { SQLiteProvider } from 'expo-sqlite'
import DrizzleStudio from '@/components/ui/DrizzleStudio'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

export default function RootLayout() {
  return (
    <Suspense fallback={<ThemeText>Loading...</ThemeText>}>
      <SQLiteProvider databaseName="test.db" onInit={runMigrations} useSuspense>
        <ActionSheetProvider>
          <>
            <DrizzleStudio></DrizzleStudio>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </>
        </ActionSheetProvider>
      </SQLiteProvider>
    </Suspense>
  )
}
