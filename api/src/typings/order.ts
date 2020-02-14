export interface Order {
  id: string
  shopId: string
  ownerId: string
  customerId: string
  status: 'Unpaid' | 'Approving' | 'Rejected' | 'Paid' | 'Canceled'
  pageId?: string
  productId?: string
  attachments?: string[]
  customerAddress?: string
  createdAt: string
  updatedAt?: string
}

export interface OrderInput {
  pageId: string
  customerId: string
  productId?: string
  attachments?: string[]
  customerAddress?: string
}
