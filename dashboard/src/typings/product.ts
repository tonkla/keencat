export default interface Product {
  id: string
  name: string
  categoryId: string
  shopId: string
  pageId: string
  owner: string
}

export interface CreateProductParams {
  name: string
  categoryId: string
  shopId: string
  pageId: string
}
