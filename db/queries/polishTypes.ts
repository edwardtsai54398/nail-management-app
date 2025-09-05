import { SQLiteDatabase } from 'expo-sqlite'
import { PolishType, QueryResult } from '@/types/ui'
import * as Crypto from 'expo-crypto'
import { errorMsg, insertInto, isDataExists } from '@/db/queries/helpers'
import { getUserId } from '@/db/queries/users'
import { OfficialPolishTypesSchema, UserPolishTypesSchema } from '@/db/schema'

export const getAllPolishTypes = async (db: SQLiteDatabase): Promise<QueryResult<PolishType[]>> => {
  try {
    const getOfficialTypes = db.getAllAsync<OfficialPolishTypesSchema>(
      `SELECT * FROM official_polish_types`,
    )
    const getUserTypes = db.getAllAsync<UserPolishTypesSchema>(`SELECT * FROM user_polish_types`)
    const [oTypeRows, uTypeRows] = await Promise.all([getOfficialTypes, getUserTypes])

    let data: PolishType[] = oTypeRows.map((type) => ({
      typeId: type.type_key,
      name: type.zh_tw,
      isOfficial: true,
    }))
    data = data.concat(
      uTypeRows.map((type) => ({
        typeId: type.polish_type_id,
        name: type.type_name,
        isOfficial: false,
      })),
    )

    return {
      success: true,
      data,
    }
  } catch (e) {
    console.error('API_CREATE_POLISH_TYPE ERROR')
    console.error(e)
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}

export const createPolishType = async (db: SQLiteDatabase, typeName: string): Promise<QueryResult<PolishType>> => {
  try {
    if (await isDataExists(db, 'user_polish_types', 'type_name', typeName)) {
      return {
        success: false,
        error: '色膠種類已存在',
      }
    }
    if (await isDataExists(db, 'official_polish_types', 'zh_tw', typeName)) {
      return {
        success: false,
        error: '色膠種類已存在',
      }
    }
    const userResult = await getUserId(db)
    if (!userResult.success) return userResult
    const userId = userResult.data
    const typeId = Crypto.randomUUID()
    const sql = insertInto('user_polish_types')
      .colVal(['polish_type_id', typeId])
      .colVal(['user_id', userId])
      .colVal(['type_name', typeName])
      .end()
    await db.runAsync(sql)

    return {
      success: true,
      data: {
        typeId,
        name: typeName,
        isOfficial: false,
      },
    }
  } catch (e: any) {
    console.error('API_CREATE_POLISH_TYPE ERROR')
    console.error(e)
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}
