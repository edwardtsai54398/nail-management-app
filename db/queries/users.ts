import { type SQLiteDatabase } from 'expo-sqlite'
import { UserSchema } from '../schema'
import { errorMsg } from '@/db/queries/helpers'
import { QueryResult } from '@/types/ui'

export const getUserId = async (db: SQLiteDatabase): Promise<QueryResult<string>> => {
  try {
    const sql = `SELECT * FROM users`
    const row = await db.getFirstAsync<UserSchema>(sql)
    if (!row)
      return {
        success: false,
        error: 'No user found',
      }
    return {
      success: true,
      data: row.id,
    }
  } catch (e) {
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}
