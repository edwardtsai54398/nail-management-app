type TypeToSQLite<T> = T extends string ? 'TEXT' : T extends number ? 'INTEGER' : never

export interface ColumnBlueprint {
  type: 'TEXT' | 'INTEGER'
  primaryKey?: boolean
  notNull?: boolean
  default?: string | number | boolean | null
  foreignKey?: {
    table: string
    column: string
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
  }
}
type ForeignKey = {
  [T in keyof Tables]: {
    table: T
    column: keyof Tables[T]
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
  }
}[keyof Tables]

type ColumnBlueprintFor<T> = Omit<ColumnBlueprint, 'type'> & {
  type: TypeToSQLite<T>
  foreignKey?: ForeignKey
}

type TableBlueprint<T extends Record<string, any>> = {
  [K in keyof T]: ColumnBlueprintFor<T[K]>
}

export const generateCreateTable = <T extends keyof Tables>(
  tableName: T,
  blueprint: Record<string, ColumnBlueprint>,
) => {
  const columnsSql = Object.entries(blueprint).map(([colName, options]) => {
    let str = `${colName} ${options.type}`
    if (options.primaryKey) str += ' PRIMARY KEY'
    if (options.notNull) str += ' NOT NULL'

    // 預設值處理
    if (options.default !== undefined) str += ` DEFAULT ${options.default}`

    return str
  })

  const foreignKeySql = Object.entries(blueprint)
    .filter(([colName, options]) => options.foreignKey)
    .map(([colName, options]) => {
      const fk = options.foreignKey!
      let str = `FOREIGN KEY(${colName}) REFERENCES ${fk.table}(${fk.column})`
      if (fk.onDelete) str += ` ON DELETE ${fk.onDelete}`
      if (fk.onUpdate) str += ` ON UPDATE ${fk.onUpdate}`
      return str
    })
  const allDefs = [...columnsSql, ...foreignKeySql]

  return `CREATE TABLE IF NOT EXISTS ${tableName} (${allDefs.join(', ')});`
}

export interface UserSchema {
  id: string
}

export const userTableBlueprint: TableBlueprint<UserSchema> = {
  id: { type: 'TEXT', primaryKey: true, notNull: true },
}

export interface UserPolishItemsSchema {
  polish_id: string
  user_id: string
  official_polish_id: string
  user_color_number: string
  series_id: string
  polish_type_id: string
  note: string
  stock: number
  is_favorite: number
  is_bind_official: number
  created_at: string
  last_updated_at: string
}

export const uPolishItemsTableBlueprint: TableBlueprint<UserPolishItemsSchema> = {
  polish_id: { type: 'TEXT', primaryKey: true, notNull: true },
  user_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'users', column: 'id', onDelete: 'CASCADE' },
  },
  official_polish_id: {
    type: 'TEXT',
    foreignKey: { table: 'official_polish_items', column: 'polish_id', onDelete: 'SET NULL' },
  },
  user_color_number: { type: 'TEXT', notNull: true },
  series_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_polish_series', column: 'series_id', onDelete: 'SET NULL' },
  },
  polish_type_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_polish_types', column: 'polish_type_id' },
  },
  note: { type: 'TEXT' },
  stock: { type: 'INTEGER', notNull: true },
  is_favorite: { type: 'INTEGER', default: 0 },
  is_bind_official: { type: 'INTEGER', default: 0 },
  created_at: { type: 'TEXT', default: '(CURRENT_TIMESTAMP)', notNull: true },
  last_updated_at: { type: 'TEXT', default: '(CURRENT_TIMESTAMP)', notNull: true },
}

export interface PolishImagesSchema {
  image_id: string
  user_id: string
  polish_id: string
  image_order: number
  url: string
  style: string
  created_at: string
  last_updated_at: string
}

export const polishImagesTableBlueprint: TableBlueprint<PolishImagesSchema> = {
  image_id: { type: 'TEXT', primaryKey: true, notNull: true },
  user_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'users', column: 'id', onDelete: 'CASCADE' },
  },
  polish_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_polish_items', column: 'polish_id', onDelete: 'CASCADE' },
  },
  image_order: { type: 'INTEGER', notNull: true },
  url: { type: 'TEXT', notNull: true },
  style: { type: 'TEXT' },
  created_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
  last_updated_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
}

export interface PolishItemColorsSchema {
  id: string
  polish_id: string
  color_type_id: string
}

export const polishItemsColorsTableBlueprint: TableBlueprint<PolishItemColorsSchema> = {
  id: { type: 'TEXT', primaryKey: true, notNull: true },
  polish_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_polish_items', column: 'polish_id', onDelete: 'CASCADE' },
  },
  color_type_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'official_color_types', column: 'color_type_id' },
  },
}

export interface UserPolishSeriesSchema {
  series_id: string
  official_series_id: string
  user_id: string
  series_name: string
  brand_id: string
  is_bind_official: number
  created_at: string
  last_updated_at: string
}

export const uPolishSeriesTableBlueprint: TableBlueprint<UserPolishSeriesSchema> = {
  series_id: { type: 'TEXT', primaryKey: true, notNull: true },
  official_series_id: {
    type: 'TEXT',
    foreignKey: { table: 'official_polish_series', column: 'series_id', onDelete: 'SET NULL' },
  },
  user_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'users', column: 'id', onDelete: 'CASCADE' },
  },
  series_name: { type: 'TEXT', notNull: true },
  brand_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_brands', column: 'brand_id', onDelete: 'CASCADE' },
  },
  is_bind_official: { type: 'INTEGER', notNull: true, default: 0 },
  created_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
  last_updated_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
}

interface UserBrandsSchema {
  brand_id: string
  user_id: string
  official_brand_id: string
  brand_name: string
  is_bind_official: number
  created_at: string
  last_updated_at: string
}

export const uBrandsTableBlueprint: TableBlueprint<UserBrandsSchema> = {
  brand_id: { type: 'TEXT', primaryKey: true, notNull: true },
  user_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'users', column: 'id', onDelete: 'CASCADE' },
  },
  official_brand_id: {
    type: 'TEXT',
    foreignKey: { table: 'official_brands', column: 'brand_id', onDelete: 'SET NULL' },
  },
  brand_name: { type: 'TEXT', notNull: true },
  is_bind_official: { type: 'INTEGER', default: 0, notNull: true },
  created_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
  last_updated_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
}

interface UserPolishTypesSchema {
  polish_type_id: string
  user_id: string
  type_name: string
  created_at: string
  last_updated_at: string
}

export const uPolishTypesTableBlueprint: TableBlueprint<UserPolishTypesSchema> = {
  polish_type_id: { type: 'TEXT', primaryKey: true, notNull: true },
  user_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'users', column: 'id', onDelete: 'CASCADE' },
  },
  type_name: { type: 'TEXT', notNull: true },
  created_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
  last_updated_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
}

interface OfficialPolishItemsSchema {
  polish_id: string
  polish_type_id: string
  series_id: string
  color_number: string
}

export const oPolishItemsTableBlueprint: TableBlueprint<OfficialPolishItemsSchema> = {
  polish_id: { type: 'TEXT', primaryKey: true, notNull: true },
  polish_type_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'official_polish_types', column: 'polish_type_id' },
  },
  series_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'official_polish_series', column: 'series_id' },
  },
  color_number: { type: 'TEXT', notNull: true },
}

interface OfficialPolishSeriesSchema {
  series_id: string
  series_name: string
  brand_id: string
}

export const oPolishSeriesTableBlueprint: TableBlueprint<OfficialPolishSeriesSchema> = {
  series_id: { type: 'TEXT', primaryKey: true, notNull: true },
  series_name: { type: 'TEXT', notNull: true },
  brand_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'official_brands', column: 'brand_id' },
  },
}

interface OfficialBrandsSchema {
  brand_id: string
  brand_name: string
}

export const oBrandsTableBlueprint: TableBlueprint<OfficialBrandsSchema> = {
  brand_id: { type: 'TEXT', primaryKey: true, notNull: true },
  brand_name: { type: 'TEXT', notNull: true },
}

interface OfficialPolishTypesSchema {
  polish_type_id: string
  type: string
}

export const oPolishTypesTableBluePrint: TableBlueprint<OfficialPolishTypesSchema> = {
  polish_type_id: { type: 'TEXT', primaryKey: true, notNull: true },
  type: { type: 'TEXT', notNull: true },
}

interface UserTagsSchema {
  tag_id: string
  user_id: string
  tag_name: string
  created_at: string
  last_updated_at: string
}

export const uTagsTableBlueprint: TableBlueprint<UserTagsSchema> = {
  tag_id: { type: 'TEXT', primaryKey: true, notNull: true },
  user_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'users', column: 'id', onDelete: 'CASCADE' },
  },
  tag_name: { type: 'TEXT', notNull: true },
  created_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
  last_updated_at: { type: 'TEXT', notNull: true, default: '(CURRENT_TIMESTAMP)' },
}

interface PolishItemTagsSchema {
  id: string
  polish_id: string
  tag_id: string
}

export const polishItemTagsTableBlueprint: TableBlueprint<PolishItemTagsSchema> = {
  id: { type: 'TEXT', primaryKey: true, notNull: true },
  polish_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_polish_items', column: 'polish_id', onDelete: 'CASCADE' },
  },
  tag_id: {
    type: 'TEXT',
    notNull: true,
    foreignKey: { table: 'user_tags', column: 'tag_id', onDelete: 'CASCADE' },
  },
}

interface OfficialColorTypesSchema {
  color_type_id: string
  color_type: string
}

export const oColorTypesTableBlueprint: TableBlueprint<OfficialColorTypesSchema> = {
  color_type_id: { type: 'TEXT', primaryKey: true, notNull: true },
  color_type: { type: 'TEXT', notNull: true },
}

export interface Tables {
  users: UserSchema
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
