import { SQLiteDatabase } from 'expo-sqlite'
import { errorMsg } from './helpers'
import type { Brand, QueryResult } from '@/types/ui'
import { UserBrandsSchema } from '@/db/schema'

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
  return { getBrands }
}
