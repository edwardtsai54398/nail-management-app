import { ThemeText } from '@/components/layout/ThemeText'
import DrizzleStudio from '@/components/ui/DrizzleStudio'
import { runMigrations } from '@/db/migrations'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { Suspense } from 'react'

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
