import { User } from './user'

export interface Page {
  id: string
  psid: string
  name: string
  ownerId: string
  accessToken: string
  issuedAt: string
  expiredAt: string
}

export interface PageInput {
  id: string
  psid: string
  name: string
  owner: User
  userAccessToken: string
}
