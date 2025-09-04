import { type SQLiteDatabase } from 'expo-sqlite'
import { UserSchema } from '../schema'

export default function (db: SQLiteDatabase) {
  async function getAllUsers() {
    console.log('getAllUsers')
    const allRows = await db.getAllAsync<UserSchema>('SELECT * FROM users')
    console.log(allRows)

    return allRows
  }

  return {
    getAllUsers,
  }
}
