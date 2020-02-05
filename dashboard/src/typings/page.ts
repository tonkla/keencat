import { User } from './user'

export interface Page {
  id: string
  psid: string
  name: string
  userAccessToken: string
  owner: User
  ownerId?: string
}
