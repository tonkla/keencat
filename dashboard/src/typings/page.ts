import { User } from './user'

export interface Page {
  id: string
  psid: string
  name: string
  owner: User
  userAccessToken: string
}
