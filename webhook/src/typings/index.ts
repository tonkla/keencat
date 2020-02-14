export interface Category {
  id: string
  name: string
  shopId: string
  pageId: string
  ownerId: string
  productIds: string[]
}

export interface Order {
  pageId: string
  customerId: string
  productId?: string
  attachments?: string[]
  customerAddress?: string
}

export interface Page {
  id: string
  psid: string
  name: string
  ownerId: string
  accessToken: string
  issuedAt: string
  expiredAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  shopId: string
  pageId: string
  ownerId: string
  images?: string[]
}

export interface Shop {
  id: string
  name: string
  pageId: string
  categoryIds: string[]
  ownerId: string
}
