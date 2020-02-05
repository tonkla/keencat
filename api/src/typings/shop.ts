import { User } from './user'

export interface Shop {
  id: string
  name: string
  pageId: string
  ownerId: string
}

export interface ShopInput {
  id: string
  name: string
  pageId: string
  owner: User
}
