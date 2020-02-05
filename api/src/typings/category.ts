import { User } from './user'

export interface Category {
  id: string
  name: string
  shopId: string
  pageId: string
  ownerId: string
}

export interface CategoryInput {
  id: string
  name: string
  shopId: string
  pageId: string
  owner: User
}
