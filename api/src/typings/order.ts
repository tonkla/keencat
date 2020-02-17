export interface Order {
  id: string
  shopId: string
  ownerId: string
  customerId: string
  status: 'unpaid' | 'approving' | 'rejected' | 'paid' | 'canceled'
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
  attachments?: string[]
}
