export type PolishImage = {
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
    images: PolishImage[]
    polishTypeKey: string,
    polishTypeName: string,
}

export type SeriesData = {
    brandId: string,
    brandName: string,
    seriesId: string
    seriesName: string
}


export type SectionData =(SeriesData & {data: Polish[][]})[]