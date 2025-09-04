import * as Crypto from 'expo-crypto'
import { type SQLiteDatabase } from 'expo-sqlite'
import {
  generateCreateTable,
  oBrandsTableBlueprint,
  oColorTypesTableBlueprint,
  oPolishItemsTableBlueprint,
  oPolishSeriesTableBlueprint,
  oPolishTypesTableBluePrint,
  polishImagesTableBlueprint,
  polishItemsColorsTableBlueprint,
  polishItemTagsTableBlueprint,
  uBrandsTableBlueprint,
  uPolishItemsTableBlueprint,
  uPolishSeriesTableBlueprint,
  uPolishStocksTableBlueprint,
  uPolishTypesTableBlueprint,
  userTableBlueprint,
  uTagsTableBlueprint
} from './schema';
import createFakeData from './createFakeData';

const OFFICIAL_POLISH_TYPES = [
    { key: 'CAT_EYE', tw: '貓眼' },
    { key: 'PEARLESCENT', tw: '珠光' },
    { key: 'SHEER_COLOR', tw: '透色' },
    { key: 'SOLID_COLOR', tw: '實色' },
    { key: 'GLITTER_GEL', tw: '亮片膠' },
    { key: 'METALLIC_GEL', tw: '金屬凝膠' },
    { key: 'PLASTER_GEL', tw: '石膏凝膠' },
    { key: 'OIL_PAINT_GEL', tw: '油畫凝膠' },
    { key: 'TAP_GEL', tw: '拍拍膠' },
    { key: 'BLOOMING_LIQUID', tw: '暈染液' },
  ]
  const OFFICIAL_COLOR_TYPES = [
    { key: 'RED', tw: '紅' },
    { key: 'PINK', tw: '粉紅' },
    { key: 'ORANGE', tw: '橘' },
    { key: 'YELLOW', tw: '黃' },
    { key: 'GREEN', tw: '綠' },
    { key: 'BLUE', tw: '藍' },
    { key: 'PURPLE', tw: '紫' },
    { key: 'WHITE', tw: '白' },
    { key: 'BLACK', tw: '黑' },
    { key: 'GRAY', tw: '灰' },
    { key: 'BROWN', tw: '棕' },
    { key: 'BEIGE', tw: '米' },
    { key: 'SILVER', tw: '銀' },
    { key: 'GOLDEN', tw: '金' }
  ]

export async function runMigrations(db: SQLiteDatabase) {
  console.log('runMigrations')
  try {
    await db.execAsync(generateCreateTable('users', userTableBlueprint))
    const userRows = (await db.getAllAsync(`SELECT COUNT(*) AS count from users`)) as {
      count: number
    }[]
    // console.log('get user count', userRows);

    const userCount = userRows[0].count
    if (userCount === 0) {
      await db.runAsync(`INSERT INTO users (id) VALUES ('${Crypto.randomUUID()}')`)
    }

    await db.execAsync(generateCreateTable('user_polish_stocks', uPolishStocksTableBlueprint))
    console.log(`Table user_polish_stocks exceuted`);

    await db.execAsync(generateCreateTable('user_polish_items', uPolishItemsTableBlueprint))
    console.log(`Table user_polish_items exceuted`)

    await db.execAsync(generateCreateTable('polish_images', polishImagesTableBlueprint))
    console.log(`Table polish_images exceuted`)

    await db.execAsync(generateCreateTable('polish_item_colors', polishItemsColorsTableBlueprint))
    console.log(`Table polish_items_color exceuted`)

    await db.execAsync(generateCreateTable('user_polish_series', uPolishSeriesTableBlueprint))
    console.log(`Table user_polish_series exceuted`)

    await db.execAsync(generateCreateTable('user_brands', uBrandsTableBlueprint))
    console.log(`Table user_brands exceuted`)

    await db.execAsync(generateCreateTable('user_polish_types', uPolishTypesTableBlueprint))
    console.log(`Table user_polish_types exceuted`);

    await db.execAsync(generateCreateTable('official_polish_types', oPolishTypesTableBluePrint))
    console.log(`Table official_polish_types exceuted`);
    //檢查是否系統色膠種類已經存在，否則寫入
    // const user = await db.getFirstAsync<UserSchema>(`SELECT id FROM users`)
    for (const item of OFFICIAL_POLISH_TYPES) {
      const exist = await db.getFirstAsync<{ isExist: number }>(
          `SELECT EXISTS(SELECT 1 FROM official_polish_types WHERE type_key = ?) as isExist`,
          item.key
      )
      if (exist!.isExist === 0) {
        await db.runAsync(
            `INSERT INTO official_polish_types (type_key, zh_tw) VALUES (?, ?)`,
            [item.key, item.tw]
        )
      }
    }

    await db.execAsync(generateCreateTable('official_polish_items', oPolishItemsTableBlueprint))

    console.log(`Table official_polish_items exceuted`)

    await db.execAsync(generateCreateTable('official_polish_series', oPolishSeriesTableBlueprint))
    console.log(`Table official_polish_series exceuted`)

    await db.execAsync(generateCreateTable('official_brands', oBrandsTableBlueprint))
    console.log(`Table official_brands exceuted`)

    await db.execAsync(generateCreateTable('user_tags', uTagsTableBlueprint))
    console.log(`Table user_tags exceuted`)

    await db.execAsync(generateCreateTable('polish_item_tags', polishItemTagsTableBlueprint))
    console.log(`Table polish_items_tag exceuted`)

    await db.execAsync(generateCreateTable('official_color_types', oColorTypesTableBlueprint))
    //檢查是否系統顏色已經存在，否則寫入
    for (const item of OFFICIAL_COLOR_TYPES) {
      const exist = await db.getFirstAsync<{ isExist: number }>(
          `SELECT EXISTS(SELECT 1 FROM official_color_types WHERE color_key = ?) as isExist`,
          item.key
      )
      // console.log(`if ${item.keyName} exists`, exist);
    
      if (exist!.isExist === 0) {
        await db.runAsync(
            `INSERT INTO official_color_types (color_key, zh_tw) VALUES (?, ?)`,
            [item.key, item.tw]
        )
      
      }
    }

    await db.execAsync(`PRAGMA foreign_keys = ON;`)

    await createFakeData(db)

  } catch (e) {
    console.error('RUN_MIGRATIONS ERROR:');
    console.error(e);
  }
}
