export interface Order {
  shopId: string
  pageId: string
  customerId: string
  productId?: string
  productName?: string
  categoryId?: string
  ownerId?: string
  attachments?: string[]
  customerAddress?: string
}
