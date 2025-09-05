import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { QueryResult, Series } from '@/types/ui'
import { errorMsg, isDataExists } from '@/db/queries/helpers'
import { getUserId } from '@/db/queries/users'
import { UserBrandsSchema } from '@/db/schema'

type GetSeriesQuery = {
  brandId?: string
}

export const getSeries = async (
  db: SQLiteDatabase,
  query?: GetSeriesQuery,
): Promise<QueryResult<Series[]>> => {
  try {
    let sql = `
        SELECT 
            S.series_id,
            S.series_name,
            B.brand_id,
            B.brand_name
        FROM user_polish_series S
        JOIN user_brands B ON B.brand_id = S.user_brand_id
        `
    if (query && query.brandId) {
      sql += `WHERE B.brand_id = '${query.brandId}' `
    }
    sql += `ORDER BY B.brand_name`

    type Row = {
      series_id: string
      series_name: string
      brand_id: string
      brand_name: string
    }

    const rows = await db.getAllAsync<Row>(sql)
    return {
      success: true,
      data: rows.map((s) => ({
        seriesId: s.series_id,
        seriesName: s.series_name,
        brandId: s.brand_id,
        brandName: s.brand_name,
      })),
    }
  } catch (e) {
    console.error('API_GET_SERIES ERROR')
    console.log(e)
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}

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
    const sql = `INSERT INTO user_polish_series (series_id, user_id, series_name, user_brand_id) VALUES (?, ?, ?, ?)`

    await db.runAsync(sql, [seriesId, userId, seriesName, brandId])

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
