import {Series} from "@/types/ui";


export const addSeries = async (brandId: string, seriesName: string): Promise<{success: boolean, data: Series}> => {
    return {
        success: true,
        data: {
            brandId,
            brandName: '',
            seriesId: `${brandId}-001`,
            seriesName
        }
    }
}