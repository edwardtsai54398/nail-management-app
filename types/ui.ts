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

export type Series = {
    brandId: string,
    brandName: string,
    seriesId: string
    seriesName: string
}



export type QueryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
export type SectionData =(Series & {data: Polish[][]})[]

export type Brand = {
    brandId: string
    brandName: string
}
