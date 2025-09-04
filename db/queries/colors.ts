import { SQLiteDatabase } from 'expo-sqlite'
import { QueryResult, Polish } from '@/types/ui'

export default function (db: SQLiteDatabase) {
  const getOfficialColors = async (): Promise<QueryResult<Pick<Polish, 'colors'>['colors']>> => {
    return {
      success: true,
      data: [
        'RED',
        'PINK',
        'ORANGE',
        'YELLOW',
        'GREEN',
        'BLUE',
        'PURPLE',
        'WHITE',
        'BLACK',
        'GRAY',
        'BROWN',
        'BEIGE',
        'SILVER',
        'GOLDEN',
      ],
    }
  }

  return {
    getOfficialColors,
  }
}
