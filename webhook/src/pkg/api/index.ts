import axios from 'axios'
import dotenv from 'dotenv'

import { Category, Product } from '../../typings'

dotenv.config()
const accessToken = process.env.API_ACCESS_TOKEN || ''
const url = process.env.API_URL || ''

const api = axios.create({ headers: { authorization: accessToken } })

async function getPageAccessToken(pageId: string): Promise<string | null> {
  try {
    const result = await api.post(url, { cmd: 'findPage', pageId })
    return result.data.pageAccessToken
  } catch (e) {
    return null
  }
}

async function resetPageAccessToken(pageId: string): Promise<boolean> {
  return false
}

async function getCategories(pageId: string): Promise<Category[]> {
  return []
}

async function getProducts(pageId: string, categoryId?: string): Promise<Product[]> {
  return []
}

export default {
  getCategories,
  getPageAccessToken,
  resetPageAccessToken,
  getProducts,
}
