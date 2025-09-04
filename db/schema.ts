type TypeToSQLite<T> =
  T extends string ? "TEXT" :
  T extends number ? "INTEGER" :
  never;

export interface ColumnBlueprint {
    type: "TEXT" | "INTEGER";
    primaryKey?: boolean;
    notNull?: boolean
    default?: string | number | boolean | null;
    foreignKey?: { 
      table: string; 
      column: string; 
      onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
      onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
    }
  }
type ForeignKey = { 
  [T in keyof Tables]: {
      table: T
      column: keyof Tables[T]
      onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION"
      onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION"
    }
}[keyof Tables]


type ColumnBlueprintFor<T> = Omit<ColumnBlueprint, "type"> & {
  type: TypeToSQLite<T>;
  foreignKey?: ForeignKey
};

type TableBlueprint<T extends Record<string, any>> = {
  [K in keyof T]: ColumnBlueprintFor<T[K]>;
};


export const generateCreateTable = <T extends keyof Tables>(tableName: T, blueprint: Record<string, ColumnBlueprint>) => {
  const columnsSql = Object.entries(blueprint)
    .map(([colName, options]) => {
      let str = `${colName} ${options.type}`
      if (options.primaryKey) str += " PRIMARY KEY"
      if (options.notNull) str += " NOT NULL"

      // 預設值處理
      if (options.default !== undefined) str += ` DEFAULT ${options.default}`;

      return str;
    })

  const foreignKeySql = Object.entries(blueprint)
  .filter(([colName, options]) => options.foreignKey)
  .map(([colName, options]) => {
    const fk = options.foreignKey!
    let str = `FOREIGN KEY(${colName}) REFERENCES ${fk.table}(${fk.column})`
    if(fk.onDelete) str += ` ON DELETE ${fk.onDelete}`
    if(fk.onUpdate) str += ` ON UPDATE ${fk.onUpdate}`
    return str
  })
  const allDefs = [...columnsSql, ...foreignKeySql]
  
  return `CREATE TABLE IF NOT EXISTS ${tableName} (${allDefs.join(', ')});`
}

export interface UserSchema {
  id: string
}

export const userTableBlueprint: TableBlueprint<UserSchema> = {
  id: {type: 'TEXT', primaryKey: true, notNull: true}
}

/*
* user_polish_stocks 使用者的色膠庫存
* ========================================
* stock_id
* user_id
* official_polish_id 如果該色膠綁定官方的話會紀錄，沒有的話則空值。關聯到官方色膠色號、色膠種類
* user_polish_id 使用者自定義該色膠的色膠色號、色膠種類。創建時就選擇官方的話會是空值
* note 備註
* stock 庫存量
* is_favorite 是否是最愛
* created_at
* last_updated_at
* ========================================
*/

export interface UserPolishStocksSchema {
  stock_id: string
  user_id: string
  official_polish_id: string
  user_polish_id: string
  note: string
  stock: number
  is_favorite: number
  created_at: string
  last_updated_at: string
}

export const uPolishStocksTableBlueprint: TableBlueprint<UserPolishStocksSchema> = {
  stock_id: {type: 'TEXT', primaryKey: true, notNull: true},
  user_id: {type:"TEXT", notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  official_polish_id: {type: "TEXT", foreignKey: {table: 'official_polish_items', column: 'polish_id', onDelete: 'SET NULL'}},
  user_polish_id: {type: "TEXT", foreignKey: {table: 'user_polish_items', column: 'polish_id', onDelete: 'SET NULL'}},
  note: {type: 'TEXT'},
  stock: {type: "INTEGER", notNull: true},
  is_favorite: {type: "INTEGER", default: 0},
  created_at: {type: "TEXT", default: '(CURRENT_TIMESTAMP)', notNull: true},
  last_updated_at: {type: "TEXT", default: '(CURRENT_TIMESTAMP)', notNull: true},
}

/**
 * user_polish_items 自建的色膠資訊
 * =========================================================
 * polish_id
 * user_id
 * color_name 色號名稱
 * official_series_id 該色膠屬於官方系列。有可能使用者選擇了官方系列，但色號自己定義
 * user_series_id 該色膠屬於哪個使用者創建的系列。要嘛綁定官方系列，要嘛綁定自建系列
 * official_polish_type 屬於使用者創建的色膠種類
 * user_polish_type 屬於使用者創建的色膠種類
 * official_polish_id 該色膠背後抬系統認定為哪個官方色膠，可以在 UI 呈現推薦綁定的色膠
 * created_at
 * last_updated_at
 * =========================================================
*/

export interface UserPolishItemsSchema {
  polish_id: string
  user_id: string
  color_name: string
  official_series_id: string
  user_series_id: string
  user_polish_type: string
  official_polish_type: string
  official_polish_id: string
  created_at: string
  last_updated_at: string
}

export const uPolishItemsTableBlueprint: TableBlueprint<UserPolishItemsSchema> = {
  polish_id: {type: 'TEXT', primaryKey: true, notNull: true},
  user_id: {type:"TEXT", notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  official_polish_id: {type: "TEXT", foreignKey: {table: 'official_polish_items', column: 'polish_id', onDelete: 'SET NULL'}},
  color_name: {type: "TEXT", notNull: true},
  official_series_id: {type: 'TEXT', foreignKey: {table: 'official_polish_series', column: 'series_id', onDelete: 'SET NULL'}},
  user_series_id: {type: 'TEXT', foreignKey: {table: 'user_polish_series', column: 'series_id', onDelete: 'SET NULL'}},
  user_polish_type: {type: 'TEXT', foreignKey: {table: 'user_polish_types', column: 'polish_type_id'}},
  official_polish_type: {type: 'TEXT', foreignKey: {table: 'official_polish_types', column: 'type_key'}},
  created_at: {type: "TEXT", default: '(CURRENT_TIMESTAMP)', notNull: true},
  last_updated_at: {type: "TEXT", default: '(CURRENT_TIMESTAMP)', notNull: true},
}

/**
 * polish_images 色膠圖片
 * =====================================================
 * image_id
 * user_id
 * stock_id 屬於哪個色膠的照片。對應到 user_polish_stocks
 * image_order 圖片順序
 * url 圖片來源
 * created_at
 * last_updated_at
 * =====================================================
 */

export interface PolishImagesSchema {
  image_id: string
  user_id: string
  stock_id: string
  image_order: number
  url: string
  created_at: string
  last_updated_at: string
}

export const polishImagesTableBlueprint: TableBlueprint<PolishImagesSchema> = {
  image_id: {type:'TEXT', primaryKey:true,notNull:true},
  user_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  stock_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'user_polish_stocks', column: 'stock_id', onDelete: 'CASCADE'}},
  image_order: {type: 'INTEGER', notNull: true},
  url: {type: 'TEXT', notNull: true},
  created_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
  last_updated_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
}

/**
 * polish_item_colors 色膠顏色中介表 
 * 備註：一個色膠可多選顏色
 * =======================================================
 * id
 * stock_id 對應到色膠庫存 user_polish_stocks
 * color_key 系統建制的顏色
 * =======================================================
 */

export interface PolishItemColorsSchema {
  id: string
  stock_id: string
  color_key: string
}

export const polishItemsColorsTableBlueprint: TableBlueprint<PolishItemColorsSchema> = {
  id: {type: 'TEXT', primaryKey: true, notNull: true},
  stock_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'user_polish_stocks', column: 'stock_id', onDelete: 'CASCADE'}},
  color_key: {type: 'TEXT', notNull:true, foreignKey: {table: 'official_color_types', column: 'color_key'}}
}

/**
 * user_polish_series 自建色膠系列
 * ========================================
 * series_id
 * user_id
 * series_name 系列名稱'
 * official_brand_id 該色膠屬於官方品牌。有可能使用者選擇了官方品牌，但系列自己創建
 * user_brand_id 該色膠屬於使用者自建的品牌。要嘛綁定官方品牌，要嘛綁定自建品牌
 * official_series_id 該系列被後台認為是哪個官方色膠系列
 * is_bind_official 使用者是否將該自建的系列綁定官方資訊
 * created_at
 * last_updated_at
 * ========================================
*/

export interface UserPolishSeriesSchema {
  series_id: string
  user_id: string
  series_name: string
  official_brand_id: string
  user_brand_id: string
  official_series_id: string
  is_bind_official: number
  created_at: string
  last_updated_at: string
}

export const uPolishSeriesTableBlueprint: TableBlueprint<UserPolishSeriesSchema> = {
  series_id: {type: 'TEXT', primaryKey: true, notNull: true},
  user_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  series_name: {type: 'TEXT', notNull: true},
  official_brand_id: {type: 'TEXT', foreignKey: {table: 'official_brands', column:'brand_id', onDelete: 'CASCADE'}},
  user_brand_id: {type: 'TEXT', foreignKey: {table: 'user_brands', column:'brand_id', onDelete: 'CASCADE'}},
  official_series_id: {type: 'TEXT', foreignKey: {table: 'official_polish_series', column: 'series_id', onDelete: 'SET NULL'}},
  is_bind_official: {type: 'INTEGER', notNull: true, default: 0},
  created_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
  last_updated_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
}

/**
 * user_brands 自建品牌
 * ==============================
 * brand_id
 * user_id
 * brand_name
 * official_brand_id 該品牌被後台認為是哪個官方品牌
 * is_bind_official 使用者是否將該自建的品牌綁定官方資訊
 * created_at
 * last_updated_at
 * ==============================
 */

interface UserBrandsSchema {
  brand_id: string
  user_id: string
  brand_name: string
  official_brand_id: string
  is_bind_official: number
  created_at: string
  last_updated_at: string
}

export const uBrandsTableBlueprint: TableBlueprint<UserBrandsSchema> = {
  brand_id: {type: 'TEXT', primaryKey: true, notNull: true},
  user_id: {type: 'TEXT',notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  brand_name: {type: 'TEXT', notNull: true},
  official_brand_id: {type: 'TEXT', foreignKey: {table: 'official_brands', column: 'brand_id', onDelete: 'SET NULL'}},
  is_bind_official: {type: 'INTEGER', default: 0, notNull: true},
  created_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
  last_updated_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'}
}

/**
 * user_polish_types 使用者自建的色膠種類
 * 備註：官方色膠種類在初始化過程也有寫入這個表，給 user_polish_items 使用
 * =========================================================
 * polish_type_id
 * user_id
 * type_name
 * created_at
 * lastUpdateAt
 * =========================================================
 */

interface UserPolishTypesSchema {
  polish_type_id: string
  user_id: string
  type_name: string
  created_at: string
  last_updated_at: string
}

export const uPolishTypesTableBlueprint: TableBlueprint<UserPolishTypesSchema> = {
  polish_type_id: {type: 'TEXT', primaryKey: true, notNull: true},
  user_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  type_name: {type: 'TEXT', notNull: true},
  created_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
  last_updated_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'}
}

/**
 * official_polish_items 官方色膠資訊
 * ===================================
 * polish_id
 * polish_type 官方色膠種類
 * series_id 官方系列
 * color_name 色號
 * ===================================
 */

interface OfficialPolishItemsSchema {
  polish_id: string
  polish_type: string
  series_id: string
  color_name: string
}

export const oPolishItemsTableBlueprint: TableBlueprint<OfficialPolishItemsSchema> = {
  polish_id: {type: 'TEXT', primaryKey:true, notNull: true},
  polish_type: {type: 'TEXT', notNull: true, foreignKey: {table: 'official_polish_types', column: 'type_key'}},
  series_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'official_polish_series', column: 'series_id'}},
  color_name: {type: 'TEXT', notNull: true}
}

/**
 * official_polish_series 官方色膠系列
 * ======================================
 * series_id
 * series_name 系列名稱
 * brand_id 官方品牌
 * ======================================
 */

interface OfficialPolishSeriesSchema {
  series_id: string
  series_name: string
  brand_id: string
}

export const oPolishSeriesTableBlueprint: TableBlueprint<OfficialPolishSeriesSchema> = {
  series_id: {type: 'TEXT', primaryKey: true, notNull: true},
  series_name: {type: 'TEXT', notNull: true},
  brand_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'official_brands', column: 'brand_id'}}
}

/**
 * official_brands 官方品牌
 * ==============================
 * brand_id
 * brand_name
 * ==============================
 */

interface OfficialBrandsSchema {
  brand_id: string
  brand_name: string
}

export const oBrandsTableBlueprint: TableBlueprint<OfficialBrandsSchema> = {
  brand_id: {type: 'TEXT', primaryKey: true, notNull: true},
  brand_name: {type: 'TEXT', notNull: true}
}

/**
 * official_polish_types 官方色膠種類
 * ===================================
 * type_key 色膠種類的 key
 * zh_tw
 * ===================================
 * 
 * key 對照表
 * CAT_EYE = 貓眼
 * PEARLESCENT = 珠光
 * SHEER_COLOR = 透色
 * SOLID_COLOR = 實色
 * GLITTER_GEL = 亮片膠
 * PLASTER_GEL = 石膏凝膠
 * OIL_PAINT_GEL = 油畫凝膠
 * METALLIC_GEL = 金屬凝膠
 * TAP_GEL = 拍拍膠
 * BLOOMING_LIQUID = 暈染液
 */

interface OfficialPolishTypesSchema {
  type_key: string
  zh_tw: string
}

export const oPolishTypesTableBluePrint: TableBlueprint<OfficialPolishTypesSchema> = {
  type_key: {type: 'TEXT', notNull: true, primaryKey:true},
  zh_tw: {type: 'TEXT', notNull:true}
}

/**
 * user_tags 使用者自建的標籤
 * ==========================
 * tag_id
 * user_id
 * tag_name 標籤名稱
 * created_at
 * lastUpdateAt
 * ==========================
 */

interface UserTagsSchema {
  tag_id: string,
  user_id: string
  tag_name: string
  created_at: string
  last_updated_at: string
}

export const uTagsTableBlueprint: TableBlueprint<UserTagsSchema> = {
  tag_id: {type: 'TEXT', primaryKey: true, notNull: true},
  user_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'users', column: 'id', onDelete: 'CASCADE'}},
  tag_name: {type: 'TEXT', notNull: true},
  created_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'},
  last_updated_at: {type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)'}
}

/**
 * polish_item_tags 色膠標籤中介表
 * 備註：一個色膠可多選標籤
 * ================================
 * id
 * stock_id 對應到 user_polish_stocks
 * tag_id 標籤，對應到 user_tags
 * ================================
 */

interface PolishItemTagsSchema {
  id: string
  stock_id: string
  tag_id: string
}

export const polishItemTagsTableBlueprint: TableBlueprint<PolishItemTagsSchema> = {
  id: {type: 'TEXT', primaryKey: true, notNull: true},
  stock_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'user_polish_stocks', column: 'stock_id', onDelete: 'CASCADE'}},
  tag_id: {type: 'TEXT', notNull: true, foreignKey: {table: 'user_tags', column: 'tag_id', onDelete: 'CASCADE'}}
}

/**
 * official_color_types 系統內建的顏色種類
 * =========================================
 * color_key 顏色種類的 key
 * zh_tw 中文名稱
 * =========================================
 * 
 * key 對照表
 * RED = 紅
 * ORANGE = 橘
 * PINK = 粉紅
 * YELLOW = 黄
 * BLUE = 藍
 * GREEN = 綠
 * WHITE = 白
 * BROWN = 棕
 * PURPLE = 紫
 * BLACK = 黑
 * GRAY = 灰
 * BEIGE = 米
 * SHILVER = 銀
 * GOLDEN = 金
 */

export interface OfficialColorTypesSchema {
  color_key: string
  zh_tw: string
}

export const oColorTypesTableBlueprint: TableBlueprint<OfficialColorTypesSchema> = {
  color_key: {type: 'TEXT', notNull: true, primaryKey: true},
  zh_tw: {type: 'TEXT', notNull: true}
}

export interface Tables {
  users: UserSchema
  user_polish_stocks: UserPolishStocksSchema
  user_polish_items: UserPolishItemsSchema
  polish_images: PolishImagesSchema
  polish_item_colors: PolishItemColorsSchema
  user_polish_series: UserPolishSeriesSchema
  user_brands: UserBrandsSchema
  user_polish_types: UserPolishTypesSchema
  official_polish_items: OfficialPolishItemsSchema
  official_polish_series: OfficialPolishSeriesSchema
  official_brands: OfficialBrandsSchema
  official_polish_types: OfficialPolishTypesSchema
  user_tags: UserTagsSchema
  polish_item_tags: PolishItemTagsSchema
  official_color_types: OfficialColorTypesSchema
}