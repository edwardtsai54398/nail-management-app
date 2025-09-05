import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { QueryResult, Tag } from '@/types/ui'
import { UserTagsSchema } from '@/db/schema'
import { errorMsg, isDataExists } from '@/db/queries/helpers'
import { getUserId } from '@/db/queries/users'

export const getTags = async (db: SQLiteDatabase): Promise<QueryResult<Tag[]>> => {
  try {
    const sql = `SELECT * FROM user_tags`
    const rows = await db.getAllAsync<UserTagsSchema>(sql)

    return {
      success: true,
      data: rows.map((t) => ({
        tagId: t.tag_id,
        name: t.tag_name,
      })),
    }
  } catch (e) {
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}

export const createTag = async (db: SQLiteDatabase, tagName: string): Promise<QueryResult<Tag>> => {
  try {
    if (await isDataExists(db, 'user_tags', 'tag_name', tagName)) {
      return {
        success: false,
        error: '標籤已存在',
      }
    }
    const userResult = await getUserId(db)
    if (!userResult.success) return userResult

    const tagId = Crypto.randomUUID()
    const userId = userResult.data
    const sql = `INSERT INTO user_tags (tag_id, user_id, tag_name) VALUES (?,?,?)`
    await db.runAsync(sql, [tagId, userId, tagName])
    return {
      success: true,
      data: {
        tagId,
        name: tagName,
      },
    }
  } catch (e) {
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}
