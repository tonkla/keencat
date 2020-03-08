export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  amount: number
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
