import { User } from './user'

export interface Page {
  id: string
  psid: string
  name: string
  owner: string
  accessToken: string
  issuedAt: string
  expiredAt: string
}

export interface PageParams {
  id: string
  psid: string
  name: string
  owner: User
  userAccessToken: string
}
