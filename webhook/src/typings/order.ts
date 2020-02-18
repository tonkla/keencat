export interface Order {
  shopId: string
  pageId: string
  customerId: string
  productId?: string
  productName?: string
  categoryId?: string
  ownerId?: string
  attachment?: string
  customerAddress?: string
}
