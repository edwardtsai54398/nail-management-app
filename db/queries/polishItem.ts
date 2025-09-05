import { SQLiteDatabase } from 'expo-sqlite'
import * as Crypto from 'expo-crypto'
import { type Polish, Series, QueryResult } from '@/types/ui'
import { errorMsg, isDataExists } from '@/db/queries/helpers'
import { getUserId } from '@/db/queries/users'

type PolishListResult = {
  series: Series[]
  polishItems: Polish[][]
}

export const getPolishList = async (db: SQLiteDatabase): Promise<QueryResult<PolishListResult>> => {
  type PolishQueryRow = {
    polishId: string
    polishName: string
    stock: number
    isFavorites: number
    note: string | null
    uPolishTypeId: string | null
    uPolishTypeName: string | null
    oPolishTypeId: string | null
    oPolishTypeName: string | null
    colorIds: string | null
    colorNames: string | null
    tagIds: string | null
    tagNames: string | null
    imgURLs: string | null
    imgOrders: string | null
    seriesId: string
    seriesName: string
    brandId: string
    brandName: string
  }
  const sql = `
        SELECT
            uPS.stock_id AS polishId,
            uP.color_name AS polishName,
            uPS.is_favorite AS isFavorites,
            uPS.stock,
            uPS.note,
            uPT.polish_type_id AS uPolishTypeId,
            uPT.type_name AS uPolishTypeName,
            oPT.type_key AS oPolishTypeId,
            oPT.zh_tw AS oPolishTypeName,
            GROUP_CONCAT(DISTINCT oC.color_key) AS colorIds,
            GROUP_CONCAT(DISTINCT oC.zh_tw) AS colorNames,
            GROUP_CONCAT(DISTINCT T.tag_id) AS tagIds,
            GROUP_CONCAT(DISTINCT T.tag_name) AS tagNames,
            GROUP_CONCAT(DISTINCT I.url) AS imgURLs,
            GROUP_CONCAT(DISTINCT I.image_order) AS imgOrders,
            uS.series_id AS seriesId,
            uS.series_name AS seriesName,
            uB.brand_id AS brandId,
            uB.brand_name AS brandName
        FROM
            user_polish_stocks uPS
            JOIN user_polish_items uP ON uPS.user_polish_id = uP.polish_id
            JOIN user_polish_series uS ON uP.user_series_id = uS.series_id
            JOIN user_brands uB ON uS.user_brand_id = uB.brand_id
            LEFT JOIN user_polish_types uPT ON uPT.polish_type_id = uP.user_polish_type
            LEFT JOIN official_polish_types oPT ON oPT.type_key = uP.official_polish_type
            JOIN polish_item_colors PC ON uPS.stock_id = PC.stock_id
            JOIN official_color_types oC ON PC.color_key = oC.color_key
            LEFT JOIN polish_item_tags PTags ON PTags.stock_id = uPS.stock_id
            LEFT JOIN user_tags T ON T.tag_id = PTags.tag_id
            LEFT JOIN polish_images I ON I.stock_id = uPS.stock_id
        GROUP BY uPS.stock_id
        ORDER BY
            uB.brand_name,
            uS.series_name,
            uPS.created_at
        `

  try {
    const rows = await db.getAllAsync<PolishQueryRow>(sql)
    const seriesMap = new Map<string, Series>([])
    const polishItemsGroupBySeries = new Map<string, Polish[]>([])
    for (const row of rows) {
      if (!seriesMap.has(row.seriesId)) {
        seriesMap.set(row.seriesId, {
          seriesId: row.seriesId,
          seriesName: row.seriesName,
          brandId: row.brandId,
          brandName: row.brandName,
        })
        polishItemsGroupBySeries.set(row.seriesId, [])
      }
      const polishItem: Polish = {
        polishId: row.polishId,
        polishName: row.polishName,
        isFavorites: row.isFavorites === 1,
        stock: row.stock,
        note: row.note || '',
        brandId: row.brandId,
        seriesId: row.seriesId,
        brandName: row.brandName,
        seriesName: row.seriesName,
        colors: row.colorIds
          ? row.colorIds.split(',').map((cId, i) => ({
              colorKey: cId,
              name: row.colorNames?.split(',')[i] || '',
            }))
          : [],
        tags: row.tagIds
          ? row.tagIds.split(',').map((tId, i) => ({
              tagId: tId,
              name: row.tagNames?.split(',')[i] || '',
            }))
          : [],
        polishType: {
          typeId: row.oPolishTypeId || row.uPolishTypeId!,
          name: row.oPolishTypeName || row.uPolishTypeName!,
          isOfficial: !!row.oPolishTypeId,
        },
        images: row.imgOrders
          ? row.imgOrders.split(',').map((imgOrder) => ({
              order: Number(imgOrder),
              url: row.imgURLs!.split(',')[Number(imgOrder) - 1],
            }))
          : [],
      }
      polishItemsGroupBySeries.set(row.seriesId, [
        ...polishItemsGroupBySeries.get(row.seriesId)!,
        polishItem,
      ])
    }
    // console.log('POLISH_QUERY_RESULT');
    // console.log(Array.from(seriesMap.values()));
    // console.log(Array.from(polishItemsGroupBySeries.values()));
    const result: PolishListResult = {
      series: Array.from(seriesMap.values()),
      polishItems: Array.from(polishItemsGroupBySeries.values()),
    }
    // console.log(rows);
    return { success: true, data: result }
  } catch (e: any) {
    console.error('GET_POLISH_LIST ERROR:')
    console.error(e)
    return { success: false, error: e?.message || 'Unknown Error' }
  }
}

export type CreatePolishQuery = {
  seriesId: string
  polishName: string
  polishType: {
    id: string
    isOfficial: boolean
  }
  colorIds: string[]
  stock: number
  isFavorites?: boolean
  tagIds?: string[]
  note?: string
  images: {
    order: number
    path: string
  }[]
}
type CreateTagResult = {
  polishId: string
}

export const createPolishItem = async (
  db: SQLiteDatabase,
  query: CreatePolishQuery,
): Promise<QueryResult<CreateTagResult>> => {
  //檢查參數
  const lackParamsError = (params: string[]) =>
    `Missing parameters: ${params.map((p) => `"${p}"`).join(', ')}`
  const missingParams = []
  if (!query.seriesId) missingParams.push('seriesId')
  if (!query.polishName) missingParams.push('polishName')
  if (!query.polishType) missingParams.push('polishType')
  if (!query.colorIds) missingParams.push('colorIds')
  if (!('stock' in query)) missingParams.push('stock')
  if (!('images' in query)) missingParams.push('images')
  if (query.polishType && (query?.polishType.id || !('isOfficial' in query.polishType))) {
    if (!query.polishType.id) missingParams.push('polishType.id')
    if (!('isOfficial' in query.polishType)) missingParams.push('polishType.isOfficial')
  }
  if (query.images) {
    let missing = false
    for (const img of query.images) {
      if (missing) break
      if (!('order' in img)) {
        missingParams.push('images.order')
        missing = true
      }
      if (!('path' in img)) {
        missingParams.push('images.path')
        missing = true
      }
    }
  }

  if (missingParams.length)
    return {
      success: false,
      error: lackParamsError(missingParams),
    }
  if (query.colorIds.length === 0)
    return {
      success: false,
      error: 'colorIds.length should greater than 0',
    }
  if (query.images.length === 0)
    return {
      success: false,
      error: 'images.length should greater than 0',
    }

  //=======================================
  try {
    //檢查 ID 是否存在
    const checkSeriesSql = `SELECT S.series_id, S.series_name, P.color_name FROM user_polish_series S JOIN user_polish_items P ON P.user_series_id = S.series_id WHERE S.series_id = ?`
    const seriesRows = await db.getAllAsync<{
      series_id: string
      color_name: string
      series_name: string
    }>(checkSeriesSql, query.seriesId)
    if (seriesRows.length === 0)
      return {
        success: false,
        error: `Not found seriesId: "${query.seriesId}"`,
      }
    const matchSeries = seriesRows.find((s) => s.color_name === query.polishName)
    if (matchSeries)
      return {
        success: false,
        error: `色號名稱已存在在系列 ${matchSeries.series_name} 中`,
      }
    if (
      !query.polishType.isOfficial &&
      !(await isDataExists(db, 'user_polish_types', 'polish_type_id', query.polishType.id))
    )
      return {
        success: false,
        error: `polishTypeId: "${query.polishType.id}" is not a custom polish type`,
      }
    if (
      query.polishType.isOfficial &&
      !(await isDataExists(db, 'official_polish_types', 'type_key', query.polishType.id))
    )
      return {
        success: false,
        error: `polishTypeId: "${query.polishType.id}" is not a official polish type`,
      }
    const colorKeyExistsSql = `SELECT color_key FROM official_color_types WHERE color_key IN (${query.colorIds.map(() => '?').join(',')})`
    const validColorRows = await db.getAllAsync<{ color_key: string }>(
      colorKeyExistsSql,
      query.colorIds,
    )
    if (validColorRows.length < query.colorIds.length) {
      const notValid: string[] = []
      query.colorIds.forEach((id) => {
        if (!validColorRows.some((color) => color.color_key === id)) {
          notValid.push(id)
        }
      })
      return {
        success: false,
        error: `colorIds: ${notValid.map((id) => `"${id}"`).join(', ')} not valid`,
      }
    }
    if (query.tagIds && query.tagIds.length) {
      const tagIdExistsSql = `SELECT tag_id FROM user_tags WHERE tag_id IN (${query.tagIds.map(() => '?').join(',')})`
      const validTagRows = await db.getAllAsync<{ tag_id: string }>(tagIdExistsSql, query.tagIds)
      if (validTagRows.length < query.tagIds.length) {
        const notValid: string[] = []
        query.tagIds.forEach((id) => {
          if (!validTagRows.some((tag) => tag.tag_id === id)) {
            notValid.push(id)
          }
        })
        return {
          success: false,
          error: `tagIds: ${notValid.map((id) => `"${id}"`).join(', ')} not valid`,
        }
      }
    }
    //=======================================
    //寫入 DB
    const userResult = await getUserId(db)
    if (!userResult.success) return userResult
    const userId = userResult.data
    const stockId = Crypto.randomUUID()
    const polishId = Crypto.randomUUID()
    await db.withTransactionAsync(async () => {
      //新增色膠
      await db.runAsync(
        `INSERT INTO 
            user_polish_items (
              polish_id, 
              user_id, 
              color_name, 
              user_series_id, 
              ${query.polishType.isOfficial ? 'official_polish_type' : 'user_polish_type'}
            ) VALUES (?,?,?,?,?)`,
        [polishId, userId, query.polishName, query.seriesId, query.polishType.id],
      )
      // console.log('user_polish_items executed')
      await db.runAsync(
        `INSERT INTO user_polish_stocks (
            stock_id, 
            user_id, 
            user_polish_id,
            note,
            stock,
            is_favorite
         ) VALUES (?,?,?,?,?,?)`,
        [stockId, userId, polishId, query.note || '', query.stock, query.isFavorites ? 0 : 1],
      )
      // console.log('user_polish_stocks executed')
      //新增圖片
      for (const img of query.images) {
        const imgId = Crypto.randomUUID()
        await db.runAsync(
          `INSERT INTO polish_images (
            image_id,
            user_id,
            stock_id,
            image_order,
            url
            ) VALUES (?,?,?,?,?)`,
          [imgId, userId, stockId, img.order, img.path],
        )
      }
      // console.log('polish_images executed')
      //新增 Tags (polish_item_tags)
      if (query.tagIds) {
        for (const tId of query.tagIds) {
          const id = Crypto.randomUUID()
          await db.runAsync(`INSERT INTO polish_item_tags (id, stock_id, tag_id) VALUES (?,?,?)`, [
            id,
            stockId,
            tId,
          ])
        }
        // console.log('polish_item_tags executed')
      }

      //新增顏色 (polish_item_colors)
      for (const cId of query.colorIds) {
        const id = Crypto.randomUUID()
        await db.runAsync(
          `INSERT INTO polish_item_colors (id, stock_id, color_key) VALUES (?,?,?)`,
          [id, stockId, cId],
        )
      }
    })
    return {
      success: true,
      data: { polishId: stockId },
    }
  } catch (e) {
    return {
      success: false,
      error: errorMsg(e),
    }
  }
}
