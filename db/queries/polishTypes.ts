import { SQLiteDatabase } from 'expo-sqlite'
import { PolishType, QueryResult } from '@/types/ui'
import * as Crypto from 'expo-crypto'

export default function (db: SQLiteDatabase) {
  const createPolishType = async (typeName: string): Promise<QueryResult<PolishType>> => {
    try {
      return {
        success: true,
        data: {
          typeId: Crypto.randomUUID(),
          name: typeName,
          isOfficial: false,
        },
      }
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || e || 'Unknown Error',
      }
    }
  }

  return {
    createPolishType,
  }
}
