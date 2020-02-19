export type ProductType = 'product' | 'service'

export enum ProductTypeEnum {
  Product = 'product',
  Service = 'service',
}

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
  amount: number
  images?: string[]
}
