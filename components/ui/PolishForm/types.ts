export type PolishFormValues = {
    brandId: string
    seriesId: string
    // colorName: string
}


export type ParamsFromSelection = {
    brandId?: string
    seriesId?: string
}

export type PolishColumnRef<T> = {
    getValue: () => T
    setValue: (v: T) => void
}

export type PolishFormRef = {
    getValues: () => PolishFormValues
    setValue: (key: keyof PolishFormValues, val: PolishFormValues[keyof PolishFormValues]) => void
}