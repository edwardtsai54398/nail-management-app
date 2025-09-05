import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { QueryResult, Tag } from '@/types/ui'

export const getTags = async (db: SQLiteDatabase): Promise<QueryResult<Tag[]>> => {
  const data = ['Y2K', '優雅', '龐克']
  try {
    return {
      success: true,
      data: data.map((t) => ({ tagId: Crypto.randomUUID(), name: t })),
    }
  } catch (e) {
    return {
      success: false,
      error: 'There was an error creating tag',
    }
  }
}

export const createTag = async (db: SQLiteDatabase, tagName: string): Promise<QueryResult<Tag>> => {
  try {
    return {
      success: true,
      data: {
        tagId: Crypto.randomUUID(),
        name: tagName,
      },
    }
  } catch (e) {
    return {
      success: false,
      error: 'There was an error creating tag',
    }
  }
}
