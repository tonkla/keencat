import { User } from './user'

export interface Shop {
  id: string
  name: string
  pageId: string
  owner: User
}
