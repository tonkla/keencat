export interface Shop {
  id: string
  name: string
  pageId: string
  owner: string
}

export interface CreateShopParams {
  name: string
  pageId: string
  userAccessToken: string
}
