import { SQLiteDatabase } from 'expo-sqlite'
import { QueryResult, Polish } from '@/types/ui'
import { errorMsg } from '@/db/queries/helpers'
import { OfficialColorTypesSchema } from '@/db/schema'

export const getOfficialColors = async (
  db: SQLiteDatabase,
): Promise<QueryResult<Pick<Polish, 'colors'>['colors']>> => {
  try {
    const sql = `SELECT * FROM official_color_types`
    const rows = await db.getAllAsync<OfficialColorTypesSchema>(sql)
    return {
      success: true,
      data: rows.map((c) => ({
        colorKey: c.color_key,
        name: c.zh_tw,
      })),
    }
  } catch (e) {
    console.error('API_GET_COLORS')
    console.error(e)
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}
