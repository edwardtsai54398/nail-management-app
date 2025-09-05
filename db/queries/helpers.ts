import { SQLiteDatabase } from 'expo-sqlite'

export const errorMsg = (e: any) => {
  if (typeof e === 'string') {
    return e
  }
  if (typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
    return e.message
  }
  return `Unknown Error`
}

export const isDataExists = async (
  db: SQLiteDatabase,
  table: string,
  col: string,
  val: string,
): Promise<boolean> => {
  const row = await db.getFirstAsync<{ isExist: number }>(
    `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${col} = ?) as isExist`,
    val,
  )
  const exists = !!row?.isExist
  if (exists) {
    console.log(`${val} exists in ${table}`)
  } else {
    console.log(`${val} NOT exists in ${table}`)
  }

  return exists
}
