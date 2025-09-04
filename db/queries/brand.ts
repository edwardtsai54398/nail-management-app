import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { errorMsg, insertInto, isDataExists } from './helpers'
import type { Brand, QueryResult } from '@/types/ui'
import { UserBrandsSchema } from '@/db/schema'
import { getUserId } from '@/db/queries/users'

export async function addBrand(brandName: string): Promise<{ data: Brand; success: boolean }> {
  return {
    success: true,
    data: {
      brandId: '001',
      brandName,
    },
  }
}

export default function (db: SQLiteDatabase) {
  const getBrands = async (): Promise<QueryResult<Brand[]>> => {
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

  const createBrand = async (brandName: string): Promise<QueryResult<Brand>> => {
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
      const sql = insertInto('user_brands')
        .colVal(['brand_id', brandId])
        .colVal(['user_id', userId])
        .colVal(['brand_name', brandName])
        .end()
      await db.runAsync(sql)
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

  return { getBrands, createBrand }
}
