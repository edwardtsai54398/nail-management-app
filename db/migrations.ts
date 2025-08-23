import * as Crypto from 'expo-crypto';
import { type SQLiteDatabase } from 'expo-sqlite';
import {
  generateCreateTable,
  oBrandsTableBlueprint,
  oColorTypesTableBlueprint,
  oPolishItemsTableBlueprint,
  oPolishSeriesTableBlueprint,
  polishImagesTableBlueprint,
  polishItemsColorsTableBlueprint,
  polishItemTagsTableBlueprint,
  uBrandsTableBlueprint,
  uPolishItemsTableBlueprint,
  uPolishSeriesTableBlueprint,
  uPolishTypesTableBlueprint,
  UserSchema,
  userTableBlueprint,
  uTagsTableBlueprint
} from './schema';

const foreignKeySql = () => {
  const constraints: string[] = [];

  const api = {
    bind(column: string) {
      return {
        to(refTable: string, refColumn: string) {
          constraints.push(`FOREIGN KEY (${column}) REFERENCES ${refTable}(${refColumn})`);
          return api; // 回到 api，支援鏈式呼叫
        }
      };
    },
    toString() {
      return constraints.join(", ");
    }
  };

  return api;
} 


export async function runMigrations(db: SQLiteDatabase) {
  console.log('runMigrations');
  const OFFICIAL_POLISH_TYPES = [
    '貓眼', 
    '珠光', 
    '透光',
    '實色',
    '亮片膠',
    '石膏凝膠',
    '油畫凝膠',
    '拍拍膠',
    '暈染液',
  ]
  const OFFICIAL_COLOR_TYPES = [
    {keyName: 'RED', id: 'b1df4c8e-5674-cd27-ac48-b54d62e2ddc5'}, 
    {keyName: 'PINK', id: 'e7b315f3-d279-3d89-c4b2-f023602bcafd'}, 
    {keyName: 'ORANGE', id: '4b46d9c1-93b8-ceb7-3fb0-245ce4c48c00'}, 
    {keyName: 'YELLOW', id: '7fe6f342-5663-7f5f-13d3-c8e0b1c838e3'}, 
    {keyName: 'GREEN', id: 'bf333eb3-5ac5-efa0-7d0d-5ea95240ddf6'}, 
    {keyName: 'BLUE', id: 'd02ebe29-cb60-5c56-748b-fe1cb9a77b51'}, 
    {keyName: 'PURPLE', id: '29e20513-02b4-7963-32cd-1afed717f192'}, 
    {keyName: 'WHITE', id: '1ddede93-012e-a74b-a68b-3d977a53efdc'}, 
    {keyName: 'BLACK', id: 'e00ad4a4-2c6c-96d3-aae0-b4ab5a6e1fd7'}, 
    {keyName: 'GRAY', id: '787f11cd-9085-86fc-5e7e-e4e9c08bb6b9'}, 
    {keyName: 'BROWN', id: '47fe6a43-af05-6db2-9123-d6ada1b5863e'}, 
    {keyName: 'BEIGE', id: '3009509d-ea9d-658d-9554-06b7ccbc62e1'}, 
    {keyName: 'SHILVER', id: '683c510c-68ce-5060-74f7-826df2c645ee'}, 
    {keyName: 'GOLDEN', id: '1036126f-8b73-3f77-02ae-a8e738fa967e'}
  ]
  try{
    await db.execAsync(generateCreateTable('users', userTableBlueprint))
    const userRows = await db.getAllAsync(`SELECT COUNT(*) AS count from users`) as {count: number}[]
    // console.log('get user count', userRows);
    
    const userCount = userRows[0].count
    if(userCount === 0){
      await db.runAsync(`INSERT INTO users (id) VALUES ('${Crypto.randomUUID()}')`)
    }


    await db.execAsync(generateCreateTable('user_polish_items', uPolishItemsTableBlueprint))
        console.log(`Table user_polish_items exceuted`);
      
    await db.execAsync(generateCreateTable('polish_images', polishImagesTableBlueprint))
    console.log(`Table polish_images exceuted`);
          
    await db.execAsync(generateCreateTable('polish_item_colors', polishItemsColorsTableBlueprint))
    console.log(`Table polish_items_color exceuted`);

    await db.execAsync(generateCreateTable('user_polish_series', uPolishSeriesTableBlueprint))
    console.log(`Table user_polish_series exceuted`);

    await db.execAsync(generateCreateTable('user_brands', uBrandsTableBlueprint))
    console.log(`Table user_brands exceuted`);

    
    await db.execAsync(generateCreateTable('user_polish_types', uPolishTypesTableBlueprint))
    console.log(`Table user_polish_types exceuted`);
    //檢查是否系統色膠種類已經存在，否則寫入
    const user = await db.getFirstAsync<UserSchema>(`SELECT id FROM users`)
    for (const item of OFFICIAL_POLISH_TYPES) {
      const exist = await db.getFirstAsync<{isExist: number}>(`SELECT EXISTS(SELECT 1 FROM user_polish_types WHERE type_name = ?) as isExist`, item)
      // console.log(`if ${item} exists`, exist);
      
    
      if(exist!.isExist === 0){
        console.log(`INSERT ${item}`);
        
        await db.runAsync(`INSERT INTO user_polish_types (polish_type_id, user_id, type_name) VALUES (?, ?, ?)`, [Crypto.randomUUID(), user!.id, item])
      }
    }

    await db.execAsync(generateCreateTable('official_polish_items', oPolishItemsTableBlueprint))

    console.log(`Table official_polish_items exceuted`);

    await db.execAsync(generateCreateTable('official_polish_series', oPolishSeriesTableBlueprint))
    console.log(`Table official_polish_series exceuted`);

    await db.execAsync(generateCreateTable('official_brands', oBrandsTableBlueprint))
    console.log(`Table official_brands exceuted`);

    await db.execAsync(generateCreateTable('user_tags', uTagsTableBlueprint))
    console.log(`Table user_tags exceuted`);

    await db.execAsync(generateCreateTable('polish_item_tags', polishItemTagsTableBlueprint))
    console.log(`Table polish_items_tag exceuted`);

    await db.execAsync(generateCreateTable('official_color_types', oColorTypesTableBlueprint))
    //檢查是否系統顏色已經存在，否則寫入
    for (const item of OFFICIAL_COLOR_TYPES) {
      const exist = await db.getFirstAsync<{isExist: number}>(`SELECT EXISTS(SELECT 1 FROM official_color_types WHERE color_type_id = ?) as isExist`, item.id)
      // console.log(`if ${item.keyName} exists`, exist);
    
      if(exist!.isExist === 0){
        await db.runAsync(`INSERT INTO official_color_types (color_type_id, color_type) VALUES (?, ?)`, [item.id, item.keyName])
      
      }
    }

    await db.execAsync(`PRAGMA foreign_keys = ON;`)

  } catch(e){
    console.error('RUN_MIGRATIONS ERROR:');
    console.error(e);
  }
      
}