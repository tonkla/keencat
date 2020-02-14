export interface Order {
  id: string
  shopId: string
  customerId: string
  productId: string
  status: 'Unpaid' | 'Approving' | 'Rejected' | 'Paid' | 'Canceled'
  pageId?: string
  attachments?: string[]
  customerAddress?: string
  createdAt: string
  updatedAt?: string
}
