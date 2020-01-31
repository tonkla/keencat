import { User } from './user'

export interface Shop {
  id: string
  name: string
  pageId: string
  owner: User
}

export interface CreateShopParams {
  name: string
  pageId: string
  userAccessToken: string
}
