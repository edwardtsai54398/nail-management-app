import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { errorMsg, isDataExists } from './helpers'
import type { Brand, QueryResult } from '@/types/ui'
import { UserBrandsSchema } from '@/db/schema'
import { getUserId } from '@/db/queries/users'

export const getBrands = async (db: SQLiteDatabase): Promise<QueryResult<Brand[]>> => {
  try {
    const sql = `SELECT * FROM user_brands`
    const rows = await db.getAllAsync<UserBrandsSchema>(sql)
    return {
      success: true,
      data: rows.map((b) => ({
        brandId: b.brand_id,
        brandName: b.brand_name,
      })),
    }
  } catch (e) {
    console.error('API_GET_BRANDS ERROR', e)
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}

export const createBrand = async (
  db: SQLiteDatabase,
  brandName: string,
): Promise<QueryResult<Brand>> => {
  try {
    if (await isDataExists(db, 'user_brands', 'brand_name', brandName)) {
      return {
        success: false,
        error: '品牌名稱已存在',
      }
    }
    const userResult = await getUserId(db)
    if (!userResult.success)
      return {
        success: false,
        error: userResult.error,
      }
    const userId = userResult.data
    const brandId = Crypto.randomUUID()
    const sql = `INSERT INTO user_brands (brand_id, user_id, brand_name) VALUES (?, ?, ?)`
    await db.runAsync(sql, [brandId, userId, brandName])
    return {
      success: true,
      data: { brandId, brandName },
    }
  } catch (e) {
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}
