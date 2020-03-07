export type OrderStatus = 'unpaid' | 'approving' | 'paid' | 'rejected' | 'canceled'

export interface Order {
  id: string
  shopId: string
  pageId: string
  ownerId: string
  customerId: string
  items: {
    productId: string
    productName: string
    price: number
    quantity: number
    amount: number
  }[]
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
  items: {
    productId: string
    productName: string
    price: number
    quantity: number
    amount: number
  }[]
  totalAmount: number
}

export interface OrderUpdate {
  id?: string
  shopId: string
  pageId: string
  customerId: string
  attachment?: string
  status?: OrderStatus
}
