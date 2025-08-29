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

export type Series = {
    brandId: string,
    brandName: string,
    seriesId: string
    seriesName: string
}


export type SectionData =(Series & {data: Polish[][]})[]

export type Brand = {
    brandId: string
    brandName: string
}