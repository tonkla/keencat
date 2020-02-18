export type OrderStatus = 'unpaid' | 'approving' | 'paid' | 'rejected' | 'canceled'

export interface Order {
  id: string
  shopId: string
  ownerId: string
  customerId: string
  status: OrderStatus
  pageId?: string
  productId?: string
  productName?: string
  attachments?: string[]
  createdAt: string
  createdDate: string
  updatedAt?: string
}

export interface OrderInput {
  pageId: string
  customerId: string
  shopId?: string
  ownerId?: string
  productId?: string
  productName?: string
  attachment?: string
  status?: string
}
