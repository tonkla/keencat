export interface LoginStatus {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse: {
    accessToken: string
    expiresIn: number
    signedRequest: string
    userID: string
  }
}

export interface Page {
  id: string
  name: string
}

export interface UserInfo {
  id: string
  name: string
  picture: string
}

export interface UserLogin {
  accessToken: string
}
