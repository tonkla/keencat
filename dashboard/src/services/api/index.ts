import axios, { AxiosResponse } from 'axios'
import auth from '../firebase/auth'
import { Category, Page, Product, Shop } from '../../typings'

interface APICallParams {
  cmd: 'createCategory' | 'createPage' | 'createProduct' | 'createShop'
  categoryId?: string
  category?: Category
  pageId?: string
  page?: Page
  productId?: string
  product?: Product
  shopId?: string
  shop?: Shop
}

async function call(params: APICallParams): Promise<AxiosResponse | null> {
  try {
    const user = await auth.getUser()
    if (!user) return null
    const authorization = await user.getIdToken()
    const uid = user.uid
    const url = process.env.REACT_APP_API_URL
    if (url) return await axios.create({ headers: { authorization, uid } }).post(url, params)
    return null
  } catch (e) {
    return null
  }
}

export default {
  call,
}
