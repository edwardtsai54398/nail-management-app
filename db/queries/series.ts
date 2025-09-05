import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { QueryResult, Series } from '@/types/ui'
import { errorMsg, insertInto, isDataExists } from '@/db/queries/helpers'
import { getUserId } from '@/db/queries/users'
import { UserBrandsSchema } from '@/db/schema'

export const createSeries = async (
  db: SQLiteDatabase,
  brandId: string,
  seriesName: string,
): Promise<QueryResult<Series>> => {
  try {
    const brand = await db.getFirstAsync<UserBrandsSchema>(
      `SELECT * FROM user_brands WHERE brand_id = ?`,
      brandId,
    )
    if (!brand) {
      return {
        success: false,
        error: '品牌不存在',
      }
    }
    if (await isDataExists(db, 'user_polish_series', 'series_name', seriesName)) {
      return {
        success: false,
        error: '系列名稱已存在',
      }
    }
    const userResult = await getUserId(db)
    if (!userResult.success) return userResult

    const userId = userResult.data
    const seriesId = Crypto.randomUUID()
    const sql = insertInto('user_polish_series')
      .colVal(['series_id', seriesId])
      .colVal(['user_id', userId])
      .colVal(['series_name', seriesName])
      .colVal(['user_brand_id', brandId])
      .end()

    await db.runAsync(sql)

    return {
      success: true,
      data: {
        brandId,
        brandName: brand.brand_name,
        seriesId,
        seriesName,
      },
    }
  } catch (e) {
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}