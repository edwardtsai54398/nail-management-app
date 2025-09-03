import {Polish, PolishType, Tag} from "@/types/ui";

export type PolishFormValues = {
    brandId: string
    seriesId: string
    colorName: string
    polishType: PolishType | null
    colors: Pick<Polish, 'colors'>['colors']
    stock: number
    isFavorites: boolean
    tags: Tag[]
}


export type ParamsFromSelection = {
    brandId?: string
    seriesId?: string
    tagIds?: string
}

export type PolishColumnRef<T> = {
    getValue: () => T
    setValue: (v: T) => void
}

export type PolishFormRef = {
    getValues: () => PolishFormValues
    setValue: <T extends keyof PolishFormValues>(key: T, val: PolishFormValues[T]) => void
}