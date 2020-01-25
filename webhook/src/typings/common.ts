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

export type EventKind = 'message' | 'postback'

export interface ResponseParams {
  kind: EventKind
  msg: string
  pageId: string
  categoryId?: string
  productId?: string
}
