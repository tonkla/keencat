import axios from 'axios'

import auth from '../firebase/auth'
import { Category, Order, Page, Product, Shop } from '../../typings'

interface APICallParams {
  id?: string
  ids?: string[]
  categoryId?: string
  category?: Category
  order?: Order
  pageId?: string
  page?: Page
  productId?: string
  product?: Product
  shopId?: string
  shop?: Shop
  file?: any
  ownerId?: string
  createdDate?: string
}

async function call(path: string, params: APICallParams) {
  try {
    const user = await auth.getUser()
    if (!user) return null
    const authorization = await user.getIdToken()
    const url = process.env.REACT_APP_API_URL
    if (url)
      return await axios.create({ headers: { authorization } }).post(`${url}/${path}`, params)
    return null
  } catch (e) {
    return null
  }
}

export default {
  call,
}
