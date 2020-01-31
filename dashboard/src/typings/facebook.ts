export interface LoginStatus {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse: {
    accessToken: string
    expiresIn: number
    signedRequest: string
    userID: string
  }
}

export interface FBPage {
  id: string
  name: string
}

export interface FBPageAccessToken {
  id: string
  access_token: string
}

export interface UserInfo {
  id: string
  name: string
  photoURL: string
}
