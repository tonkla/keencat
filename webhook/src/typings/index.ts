export interface Category {
  id: string
  name: string
  shopId: string
  pageId: string
  ownerId: string
  productIds: string[]
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
