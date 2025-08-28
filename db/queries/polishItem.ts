import { type Polish, SeriesData, QueryResult } from "@/types/data";
import { SQLiteDatabase } from "expo-sqlite";

type PolishListResult = {
    series: SeriesData[]
    polishItems: Polish[][]
}

export default function(db: SQLiteDatabase) {
    type PolishQueryRow = {
        polish_id: string
        polish_name: string
        type_name: string
        colors: string | null
        tags: string | null
        img_urls: string | null
        img_orders: string | null
        stock: number
        is_favorite: number
        note: string | null
        series_id: string,
        series_name: string
        brand_id: string
        brand_name: string
    }

    const getPolishList = async (): Promise<QueryResult<PolishListResult>> => {
        const sql = `
        SELECT
            P.polish_id,
            P.user_color_number AS polish_name,
            PT.type_name,
            GROUP_CONCAT(DISTINCT OC.color_type) AS colors,
            GROUP_CONCAT(DISTINCT T.tag_name) AS tags,
            GROUP_CONCAT(DISTINCT I.url) AS img_urls,
            GROUP_CONCAT(DISTINCT I.image_order) AS img_orders,
            P.stock,
            P.is_favorite,
            P.note,
            S.series_id,
            S.series_name,
            B.brand_id,
            B.brand_name
        FROM
            user_polish_items P
            JOIN user_polish_series S ON P.series_id = S.series_id
            JOIN user_brands B ON S.brand_id = B.brand_id
            JOIN user_polish_types PT ON P.polish_type_id = PT.polish_type_id
            JOIN polish_item_colors PC ON PC.polish_id = P.polish_id
            JOIN official_color_types OC ON OC.color_type_id = PC.color_type_id
            LEFT JOIN polish_item_tags PTags ON PTags.polish_id = P.polish_id
            LEFT JOIN user_tags T ON T.tag_id = PTags.tag_id
            LEFT JOIN polish_images I ON I.polish_id = P.polish_id
        GROUP BY P.polish_id
        ORDER BY
            B.brand_name,
            S.series_name,
            P.created_at
        `
        
        try {
            const rows = await db.getAllAsync<PolishQueryRow>(sql)
            const seriesMap = new Map<string, SeriesData>([])
            const polishItemsGroupBySeries = new Map<string, Polish[]>([])
            for(const row of rows) {
                if(!seriesMap.has(row.series_id)) {
                    seriesMap.set(row.series_id, {
                        seriesId: row.series_id,
                        seriesName: row.series_name,
                        brandId: row.brand_id,
                        brandName: row.brand_name
                    })
                    polishItemsGroupBySeries.set(row.series_id, [])
                }
                const polishItem: Polish = {
                    polishId: row.polish_id,
                    polishName: row.polish_name,
                    isFavorites: row.is_favorite === 1,
                    stock: row.stock,
                    note: row.note || '',
                    brandId: row.brand_id,
                    seriesId: row.series_id,
                    brandName: row.brand_name,
                    seriesName: row.series_name,
                    colors: row.colors ? row.colors.split(',') : [],
                    tags: row.tags ? row.tags.split(',') : [],
                    polishType: {name: row.type_name},
                    images: row.img_orders ? row.img_orders.split(',').map(imgOrder => (
                        {
                            order: Number(imgOrder),
                            url: row.img_urls!.split(',')[Number(imgOrder) - 1]
                        }
                    )) : []
                }
                polishItemsGroupBySeries.set(row.series_id, [
                    ...polishItemsGroupBySeries.get(row.series_id)!,
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