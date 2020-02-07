import axios, { AxiosResponse } from 'axios'

import auth from '../firebase/auth'
import { Category, Page, Product, Shop } from '../../typings'

interface APICallParams {
  categoryId?: string
  category?: Category
  pageId?: string
  page?: Page
  productId?: string
  product?: Product
  shopId?: string
  shop?: Shop
  ownerId?: string
}

async function call(path: string, params: APICallParams): Promise<AxiosResponse | null> {
  try {
    const user = await auth.getUser()
    if (!user) return null
    const authorization = await user.getIdToken()
    const url = process.env.REACT_APP_API_URL
    if (url) return await axios.create({ headers: { authorization } }).post(`${url}${path}`, params)
    return null
  } catch (e) {
    return null
  }
}

export default {
  call,
}
