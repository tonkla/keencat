import { User } from './user'

export interface Product {
  id: string
  name: string
  categoryId: string
  shopId: string
  pageId: string
  owner: User
}
