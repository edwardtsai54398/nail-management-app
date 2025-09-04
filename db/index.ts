import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('nail-supplies-management.db')

export function getDb() {
  if (!db) throw new Error('DB not initialized yet')
  return db
}
