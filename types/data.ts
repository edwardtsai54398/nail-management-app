export type PolishImage = {
    order: number
    url: string
}
export type Polish = {
    polishId: string
    polishName: string
    isFavorites: boolean
    stock: number
    brandId?: string
    brandName: string
    seriesId?: string
    seriesName: string
    colors: string[]
    note: string
    images: PolishImage[]
    polishType: {
        name: string
    },
    tags: string[]
}

export type SeriesData = {
    brandId: string,
    brandName: string,
    seriesId: string
    seriesName: string
}


export type SectionData =(SeriesData & {data: Polish[][]})[]

export type QueryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };