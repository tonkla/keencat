export type ProductType = 'goods' | 'service'

export interface Product {
  id: string
  type: ProductType
  name: string
  description: string
  categoryId: string
  shopId: string
  pageId: string
  ownerId: string
  isActive: boolean
  price: number
  quantity: number
  images?: string[]
}
