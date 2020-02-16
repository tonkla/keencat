export type OrderStatus = 'unpaid' | 'approving' | 'rejected' | 'paid' | 'canceled'

export interface Order {
  id: string
  shopId: string
  ownerId: string
  customerId: string
  productId: string
  productName: string
  status: OrderStatus
  pageId?: string
  attachments?: string[]
  customerAddress?: string
  createdAt: string
  updatedAt?: string
}
