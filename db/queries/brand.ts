import type { Brand } from '@/types/ui'

export async function getBrands(): Promise<{ data: Brand[] }> {
  const brands = [
    { name: 'Cleto', id: '02ee41c7-37b6-bed2-7836-807452911ddb' },
    { name: 'THE FAVORI', id: 'THE FAVORI' },
    { name: 'HE', id: 'HE' },
  ]

  return {
    data: brands.map((b) => ({
      brandId: b.id,
      brandName: b.name,
    })),
  }
}

export async function addBrand(brandName: string): Promise<{ data: Brand; success: boolean }> {
  return {
    success: true,
    data: {
      brandId: '001',
      brandName,
    },
  }
}
