export interface Category {
  id: string
  name: string
  shopId: string
  pageId: string
  owner: string
}

export interface CreateCategoryParams {
  name: string
  shopId: string
  pageId: string
}
