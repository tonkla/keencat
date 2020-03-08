export type OrderStatus = 'unpaid' | 'approving' | 'paid' | 'rejected' | 'canceled'

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  amount: number
}

export interface Order {
  id: string
  shopId: string
  pageId: string
  ownerId: string
  customerId: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  attachments?: string[]
  createdAt: string
  createdDate: string
  updatedAt?: string
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
  id?: string
  shopId: string
  pageId: string
  customerId: string
  attachment?: string
  status?: OrderStatus
  note?: string
}
