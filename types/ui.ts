export type PolishImage = {
  order: number
  url: string
}

export type PolishType = {
  typeId: string
  name: string
  isOfficial: boolean
}

export type Tag = {
  tagId: string
  name: string
}
export type Color = {
  colorKey: string
  name: string
}
export type Polish = {
  polishId: string
  polishName: string
  isFavorites: boolean
  stock: number
  brandId: string
  brandName: string
  seriesId: string
  seriesName: string
  colors: Color[]
  note: string
  images: PolishImage[]
  polishType: PolishType
  tags: Tag[]
}

export type Series = {
  brandId: string
  brandName: string
  seriesId: string
  seriesName: string
}

export type QueryResult<T> = { success: true; data: T } | { success: false; error: string }
export type SectionData = (Series & { data: Polish[][] })[]

export type Brand = {
  brandId: string
  brandName: string
}
