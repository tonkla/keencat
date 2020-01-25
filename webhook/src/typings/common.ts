export interface Category {
  id: string
  name: string
  shopId: string
  pageId: string
}

export interface Product {
  id: string
  name: string
  categoryId: string
  shopId: string
  pageId: string
}
