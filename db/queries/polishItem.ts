import { SQLiteDatabase } from "expo-sqlite";
import {type Polish, Series, QueryResult} from "@/types/ui";

type PolishListResult = {
    series: Series[]
    polishItems: Polish[][]
}

export default function(db: SQLiteDatabase) {
    type PolishQueryRow = {
        polishId: string
        polishName: string
        stock: number
        isFavorites: number
        note: string | null
        uPolishTypeId: string | null
        uPolishTypeName: string | null
        oPolishTypeId: string | null
        oPolishTypeName: string | null
        colorIds: string | null
        colorNames: string | null
        tagIds: string | null
        tagNames: string | null
        imgURLs: string | null
        imgOrders: string | null
        seriesId: string,
        seriesName: string
        brandId: string
        brandName: string
    }

    const getPolishList = async (): Promise<QueryResult<PolishListResult>> => {
        const sql = `
        SELECT
            uPS.stock_id AS polishId,
            uP.color_name AS polishName,
            uPS.is_favorite AS isFavorites,
            uPS.stock,
            uPS.note,
            uPT.polish_type_id AS uPolishTypeId,
            uPT.type_name AS uPolishTypeName,
            oPT.type_key AS oPolishTypeId,
            oPT.zh_tw AS oPolishTypeName,
            GROUP_CONCAT(DISTINCT oC.color_key) AS colorIds,
            GROUP_CONCAT(DISTINCT oC.zh_tw) AS colorNames,
            GROUP_CONCAT(DISTINCT T.tag_id) AS tagIds,
            GROUP_CONCAT(DISTINCT T.tag_name) AS tagNames,
            GROUP_CONCAT(DISTINCT I.url) AS imgURLs,
            GROUP_CONCAT(DISTINCT I.image_order) AS imgOrders,
            uS.series_id AS seriesId,
            uS.series_name AS seriesName,
            uB.brand_id AS brandId,
            uB.brand_name AS brandName
        FROM
            user_polish_stocks uPS
            JOIN user_polish_items uP ON uPS.user_polish_id = uP.polish_id
            JOIN user_polish_series uS ON uP.user_series_id = uS.series_id
            JOIN user_brands uB ON uS.user_brand_id = uB.brand_id
            LEFT JOIN user_polish_types uPT ON uPT.polish_type_id = uP.user_polish_type
            LEFT JOIN official_polish_types oPT ON oPT.type_key = uP.official_polish_type
            JOIN polish_item_colors PC ON uPS.stock_id = PC.stock_id
            JOIN official_color_types oC ON PC.color_key = oC.color_key
            LEFT JOIN polish_item_tags PTags ON PTags.stock_id = uPS.stock_id
            LEFT JOIN user_tags T ON T.tag_id = PTags.tag_id
            LEFT JOIN polish_images I ON I.stock_id = uPS.stock_id
        GROUP BY uPS.stock_id
        ORDER BY
            uB.brand_name,
            uS.series_name,
            uPS.created_at
        `
        
        try {
            const rows = await db.getAllAsync<PolishQueryRow>(sql)
            const seriesMap = new Map<string, Series>([])
            const polishItemsGroupBySeries = new Map<string, Polish[]>([])
            for(const row of rows) {
                if(!seriesMap.has(row.seriesId)) {
                    seriesMap.set(row.seriesId, {
                        seriesId: row.seriesId,
                        seriesName: row.seriesName,
                        brandId: row.brandId,
                        brandName: row.brandName
                    })
                    polishItemsGroupBySeries.set(row.seriesId, [])
                }
                const polishItem: Polish = {
                    polishId: row.polishId,
                    polishName: row.polishName,
                    isFavorites: row.isFavorites === 1,
                    stock: row.stock,
                    note: row.note || '',
                    brandId: row.brandId,
                    seriesId: row.seriesId,
                    brandName: row.brandName,
                    seriesName: row.seriesName,
                    colors: row.colorIds ? row.colorIds.split(',').map((cId, i) => ({
                        colorKey: cId,
                        name: row.colorNames?.split(',')[i] || ''
                    })) : [],
                    tags: row.tagIds ? row.tagIds.split(',').map((tId, i) => ({
                        tagId: tId,
                        name: row.tagNames?.split(',')[i] || ''
                    })) : [],
                    polishType: {
                        typeId: row.oPolishTypeId || row.uPolishTypeId!,
                        name: row.oPolishTypeName || row.uPolishTypeName!,
                        isOfficial: row.oPolishTypeId ? true : false
                    },
                    images: row.imgOrders ? row.imgOrders.split(',').map(imgOrder => (
                        {
                            order: Number(imgOrder),
                            url: row.imgURLs!.split(',')[Number(imgOrder) - 1]
                        }
                    )) : []
                }
                polishItemsGroupBySeries.set(row.seriesId, [
                    ...polishItemsGroupBySeries.get(row.seriesId)!,
                    polishItem
                ])

            }
            // console.log('POLISH_QUERY_RESULT');
            // console.log(Array.from(seriesMap.values()));
            // console.log(Array.from(polishItemsGroupBySeries.values()));
            const result: PolishListResult = {
                series: Array.from(seriesMap.values()),
                polishItems: Array.from(polishItemsGroupBySeries.values())
            }
            // console.log(rows);
            return {success: true, data: result}
            
        } catch(e: any) {
            console.error('GET_POLISH_LIST ERROR:');
            console.error(e);
            return {success: false, error: e?.message || 'Unknown Error'}
        }
    }


    return {
        getPolishList
    }
}