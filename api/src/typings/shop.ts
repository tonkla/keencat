import { User } from './user'

export interface Shop {
  id: string
  name: string
  pageId: string
  owner: string
}

export interface ShopParams {
  id: string
  name: string
  pageId: string
  owner: User
}
