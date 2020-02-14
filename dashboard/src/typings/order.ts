export interface Order {
  id: string
  shopId: string
  ownerId: string
  customerId: string
  productId: string
  productName: string
  status: 'unpaid' | 'approving' | 'rejected' | 'paid' | 'canceled'
  pageId?: string
  attachments?: string[]
  customerAddress?: string
  createdAt: string
  updatedAt?: string
}
