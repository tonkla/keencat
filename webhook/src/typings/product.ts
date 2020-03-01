export type ProductType = 'goods' | 'service'

export interface Product {
  id: string
  name: string
  description: string
  type: ProductType
  isActive: boolean
  price: number
  quantity: number
  categoryId: string
  shopId: string
  pageId: string
  ownerId: string
  images?: string[]
}
