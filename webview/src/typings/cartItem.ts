import { Product } from './product'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  amount: number
  shopId: string
  pageId: string
  customerId: string
  updatedAt: string
}
