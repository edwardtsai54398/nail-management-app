export type PolishImage = {
    url: string
}
export type Polish = {
    polishId: string
    poslishName: string
    isFavorites: boolean
    stock: number
    brandName: string
    seriesName: string
    color: string
    images: PolishImage[]
}

export type SectionData = {
    title: string,
    data: Polish[][]
}[]