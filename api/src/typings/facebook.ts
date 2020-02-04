export interface FBPage {
  access_token: string
  category: string
  category_list: string[]
  name: string
  id: string
  tasks: string[]
}

export interface FBUserAccessToken {
  access_token: string
  token_type: string
}

export interface FBUserPageToken {
  app_id: string
  type: string
  application: string
  data_access_expires_at: number
  expires_at: number
  is_valid: boolean
  issued_at: number
  profile_id: string
  scopes: string[]
  granular_scopes: string[]
  user_id: string
}
