export interface FBLoginStatus {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse: {
    accessToken: string
    expiresIn: number
    signedRequest: string
    userID: string
  }
}

export interface FBPage {
  access_token: string
  category: string
  category_list: string[]
  name: string
  id: string
  tasks: string[]
}

export interface FBPageAccessToken {
  id: string
  access_token: string
}

export interface FBUserInfo {
  id: string
  name: string
  photoURL: string
}
