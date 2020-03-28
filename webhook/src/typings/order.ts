export interface OrderItem {
  productId: string
  price: number
  amount: number
  quantity?: number
  date?: string
  from?: string
  to?: string
  days?: number
  hour?: string
  month?: string
}

export interface OrderCreate {
  shopId: string
  pageId: string
  ownerId: string
  customerId: string
  items: OrderItem[]
  totalAmount: number
}

export interface OrderUpdate {
  shopId: string
  pageId: string
  customerId: string
  attachment: string
}
