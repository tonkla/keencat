import { User } from './user'

export interface Page {
  id: string
  owner: User
  name?: string
  accessToken?: string
  issuedAt?: string
  expiredAt?: string
}
