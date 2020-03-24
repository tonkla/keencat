export type ProductType = 'goods' | 'service'
export type ProductChargeType = 'hourly' | 'daily' | 'monthly'

export enum ProductTypeEnum {
  Goods = 'goods',
  Service = 'service',
}
export enum ProductChargeTypeEnum {
  Hourly = 'hourly',
  Daily = 'daily',
  Monthly = 'monthly',
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
  quantity?: number
  charge?: ProductChargeType
  openAt?: string
  closeAt?: string
  images?: string[]
}
