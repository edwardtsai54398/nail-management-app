import {type Polish, Series} from "@/types/ui";

type PolishListResult = {
    series: Series[]
    polishItems: Polish[][]
}
export async function mockGetPolishItems(){
    const polishNames = [
        {name: 'black', image: 'https://baseec-img-mng.akamaized.net/images/item/origin/d7a6976fa192ce8ef274b8090d5ed415.png?imformat=generic'},
        {name: 'white', image: 'https://baseec-img-mng.akamaized.net/images/item/origin/216b7ebf087767efa4afe05337448956.png?imformat=generic'},
        {name: 'beige', image: 'https://baseec-img-mng.akamaized.net/images/item/origin/4c0bdfaa86584b27cd8ae73676dfbc7e.png?imformat=generic'}
    ]
    const brands = [
        {name: 'Cleto', id:'02ee41c7-37b6-bed2-7836-807452911ddb'},
    ]
    const series = [
        {name: 'Basic Mag', id: '27dac283-660f-bb22-70f2-92c9214f02bf', count: 10, polishTypeKey: 'CAT_EYE'},
        {name: 'MOMOME', id: '165adb94-710b-2e17-8f42-8bfdc0505b92', count: 12, polishTypeKey: 'BLOOMING_LIQUID'},
        {name: 'kura-kura', id: 'f21ba651-a2cf-ed24-85ff-8582211be94c', count: 7, polishTypeName: '水波膠'},
    ]
    const result: PolishListResult = {
        series: [],
        polishItems: []
    }
    let polishId = 0
    brands.forEach(brand => {
        series.forEach(s => {
            result.series.push({
                brandId: brand.id,
                brandName:  brand.name,
                seriesName: s.name,
                seriesId: s.id,
            })
            const thisPolishBatch: Polish[] = []
            for(let i=0;i<s.count;i++){
                const index = Math.floor(Math.random() * polishNames.length)
                thisPolishBatch.push({
                    polishId: `${polishId}`,
                    polishName: polishNames[index].name,
                    isFavorites: index === 0 ? true : false,
                    stock: 1,
                    brandId: brand.id,
                    brandName:  brand.name,
                    seriesName: s.name,
                    seriesId: s.id,
                    colors: [polishNames[index].name.toUpperCase()],
                    images: [{url: polishNames[index].image}],
                    polishTypeKey: s.polishTypeKey || '',
                    polishTypeName: s.polishTypeName || ''
                })
                polishId ++
            }
            result.polishItems.push(thisPolishBatch)

        })
    })

    return result
}