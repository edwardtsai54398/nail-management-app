import type { SQLiteDatabase } from "expo-sqlite";
import { insertInto } from "./queries/helpers";
import type { OfficialColorTypesSchema } from "./schema";

const fakeImages = [
  'https://picsum.photos/id/237/200/300',
  'https://picsum.photos/id/238/200/300',
  'https://picsum.photos/id/239/200/300',
  'https://picsum.photos/id/240/200/300',
  'https://picsum.photos/id/241/200/300',
  'https://picsum.photos/id/242/200/300',
  'https://picsum.photos/id/243/200/300',
  'https://picsum.photos/id/244/200/300',
  'https://picsum.photos/id/248/200/300',
  'https://picsum.photos/id/251/200/300',
]

const userPolishItems = [
  {
    brandName: 'THE FAVORI',
    series: [
      {
        name: 'SATIN MADE COLLECTION',
        polishType: 'METALLIC_GEL',
        isTypeOfficial: true,
        items: [
          {name: 'SILENT SCENT', color: ['PURPLE'], tags: ['Y2K']},
          {name: 'SHADOW LINE', color: ['WHITE', 'PINK'], tags: ['Y2K']},
          {name: 'SILVER', color: ['GRAY', 'SILVER'], tags: ['Y2K']},
          {name: 'CLASS WARMTH', color: ['PINK'], tags: ['Y2K']},
          {name: 'SOFT TRACE', color: ['PINK', 'RED'], tags: ['Y2K']},
          {name: 'GOLDEN DUSK', color: ['GOLDEN', 'BROWN'], tags: ['Y2K']},
          {name: 'FADED WHISPER', color: ['PINK', 'PURPLE'], tags: ['Y2K']}
        ]
      },
      {
        name: 'LN',
        polishType: '水波膠',
        isTypeOfficial: false,
        items: [
          {name: 10, color: ['ORANGE'], tags:[]}, 
          {name: 11, color: ['YELLOW'], tags:[]},
          {name: 12, color: ['BLUE'], tags:[]},
          {name: 13, color: ['GREEN'], tags:[]}
        ]
      }
    ],
  },
  {
    brandName: 'HOHO',
    series: [
      {
        name: 'HE',
        polishType: 'SOLID_COLOR',
        isTypeOfficial: true,
        items: [
          {name: '01', color: ['BEIGE'], tags: ['優雅', '奶茶色']}, 
          {name: '02', color: ['BEIGE'], tags: ['優雅', '奶茶色']}, 
          {name: '03', color: ['BROWN'], tags: ['優雅']}, 
        ]
      }
    ]
  }
]


export default async function(db: SQLiteDatabase){
  const isDataExists = async(table: string, col: string, val: string): Promise<boolean> => {
    const row = await db.getFirstAsync<{isExist: number}>(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${col} = ?) as isExist`, val)
    const exists = !!row?.isExist
    if(exists) {
      console.log(`${val} exists in ${table}`);
      
    } else {
      console.log(`${val} NOT exists in ${table}`);

    }
    
    return exists
  } 
  try {
    const row = await db.getFirstAsync<{id: string}>(`SELECT id FROM users`)
    if(!row) return
    const {id: userId} = row
    console.log(`userId is ${userId}`);
    

    for(const i in userPolishItems) {
      //新增品牌
      const brandId = `0${i}`
      if(!(await isDataExists('user_brands', 'brand_id', brandId))){

        await db.runAsync(insertInto('user_brands')
          .colVal(['brand_id', brandId])
          .colVal(['user_id', userId])
          .colVal(['brand_name', userPolishItems[i].brandName])
          .end()
        )
        console.log(`brand ${userPolishItems[i].brandName} excecuted`);
      }
      const series = userPolishItems[i].series
      for(const j in series){
        //新增系列
        const seriesId = `${brandId}-0${j}`
        if(!(await isDataExists('user_polish_series', 'series_id', seriesId))){
          await db.runAsync(insertInto('user_polish_series')
            .colVal(['series_id', seriesId])
            .colVal(['user_id', userId])
            .colVal(['series_name', series[j].name])
            .colVal(['user_brand_id', `0${i}`])
            .end()
          )
          
          console.log(`series ${series[j].name} excecuted`);
        }
        
        if(!series[j].isTypeOfficial){
          //新增使用者自建 polishTypes
          if(!(await isDataExists('user_polish_types', 'polish_type_id', seriesId))){
            await db.runAsync(insertInto('user_polish_types')
              .colVal(['polish_type_id', seriesId])
              .colVal(['user_id', userId])
              .colVal(['type_name', series[j].polishType])
              .end()
            )
            console.log(`polishTypes ${series[j].polishType} excecuted`);

          }
      }
      const items = series[j].items
      for(const k in items) {
        //新增色膠
        const itemId = `0${i}-0${j}-0${k}`
        if(!(await isDataExists('user_polish_items', 'polish_id', itemId))){
            
          await db.runAsync(insertInto('user_polish_items')
            .colVal(['polish_id', itemId])
            .colVal(['user_id', userId])
            .colVal(['color_name', items[k].name])
            .colVal(['user_series_id', seriesId])
            .colVal([series[j].isTypeOfficial ? 'official_polish_type' : 'user_polish_type', series[j].isTypeOfficial ? series[j].polishType : seriesId])
            .end()
          )
          console.log(`items ${series[j].polishType} excecuted`);
          await db.runAsync(insertInto('user_polish_stocks')
            .colVal(['stock_id', itemId])
            .colVal(['user_id', userId])
            .colVal(['stock', 1])
            .colVal(['user_polish_id', itemId])
            .end()
          )
          console.log(`stocks ${series[j].polishType} excecuted`);

          //新增色膠顏色
          const colors = items[k].color
          const colorRows = await db.getAllAsync<OfficialColorTypesSchema>(`SELECT * FROM official_color_types`)
          for(const q in colors) {
            const colorType = colorRows.find(c => c.color_key === colors[q])!.color_key
            console.log(colorType);
            
            await db.runAsync(insertInto('polish_item_colors')
              .colVal(['id', `${itemId}-${q}`])
              .colVal(['stock_id', itemId])
              .colVal(['color_key', colorType])
              .end()
            )
          }
          //新增 Tags
          const tags = items[k].tags
          for(const q in tags) {
            const tag = tags[q]
            const tagRow = await db.getFirstAsync<{isExist: number}>(`SELECT EXISTS(SELECT 1 FROM user_tags WHERE tag_id = ?) as isExist`, tag)
            if(!tagRow?.isExist) {
              await db.runAsync(insertInto('user_tags')
                .colVal(['tag_id', tag])
                .colVal(['user_id', userId])
                .colVal(['tag_name', tag])
                .end()
              )
            }
            await db.runAsync(insertInto('polish_item_tags')
              .colVal(['id', `${itemId}-${q}`])
              .colVal(['stock_id', itemId])
              .colVal(['tag_id', tag])
              .end()
            )
          }

          //新增圖片
          const imgCount = Math.floor(Math.random() * (3 - 1 + 1)) + 1
          for(let q = 0; q<imgCount; q++){
            const imgIndex = Math.floor(Math.random() * (9 - 0 + 1)) + 0
            await db.runAsync(insertInto('polish_images')
              .colVal(['image_id', `${itemId}-${q}${imgIndex}`])
              .colVal(['user_id', userId])
              .colVal(['stock_id', itemId])
              .colVal(['image_order', q + 1])
              .colVal(['url', fakeImages[imgIndex]])
              .end()
            )
          }
        }
        
          
        }
      }
      
    }
    
  } catch(e) {
    console.error('CREATE_FAKE_DATA ERROR:');
    console.error(e);
    
    
  }
}