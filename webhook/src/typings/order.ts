export interface Order {
  shopId: string
  pageId: string
  customerId: string
  amount?: number
  productId?: string
  productName?: string
  categoryId?: string
  ownerId?: string
  attachment?: string
  customerAddress?: string
}
