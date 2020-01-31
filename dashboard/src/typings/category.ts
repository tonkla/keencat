import { User } from './user'

export interface Category {
  id: string
  name: string
  shopId: string
  pageId: string
  owner: User
}

export interface CreateCategoryParams {
  name: string
  shopId: string
  pageId: string
}
