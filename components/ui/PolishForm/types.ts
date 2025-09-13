import { PolishImage, PolishType } from '@/types/ui'

export type PolishFormValues = {
  brandId: string
  seriesId: string
  colorName: string
  polishType: PolishType | null
  colorIds: string[]
  stock: number
  isFavorites: boolean
  tagIds: string[]
  note: string
  images: PolishImage[]
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
