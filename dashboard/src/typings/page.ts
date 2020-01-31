import { User } from './user'

export interface Page {
  id: string
  owner: User
  name?: string
  facebookPageId?: string
  pageAccessToken?: string
  userAccessToken?: string
}
