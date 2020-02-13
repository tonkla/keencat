import axios from 'axios'
import dotenv from 'dotenv'

import { Category, Product, Shop } from '../../typings'

dotenv.config()
const accessToken = process.env.API_ACCESS_TOKEN || ''
const url =
  (process.env.NODE_ENV === 'development' ? process.env.API_URL_DEV : process.env.API_URL) || ''

const api = axios.create({ headers: { authorization: accessToken } })

async function getPageAccessToken(pageId: string): Promise<string | null> {
  try {
    const { data } = await api.post(`${url}/find-page`, { pageId })
    return data && data.accessToken ? data.accessToken : null
  } catch (e) {
    return null
  }
}

async function resetPageAccessToken(pageId: string): Promise<boolean> {
  return false
}

async function findCategories(pageId: string): Promise<Category[]> {
  try {
    const { data } = await api.post(`${url}/find-categories`, { pageId })
    return data ? data : []
  } catch (e) {
    return []
  }
}

async function findProducts(pageId: string, categoryId?: string): Promise<Product[]> {
  try {
    const { data } = await api.post(`${url}/find-products`, { pageId, categoryId })
    return data ? data : []
  } catch (e) {
    return []
  }
}

async function findProduct(pageId: string, productId: string): Promise<Product | null> {
  try {
    const { data } = await api.post(`${url}/find-product`, { pageId, productId })
    return data ? data : null
  } catch (e) {
    return null
  }
}

async function findShop(pageId: string): Promise<Shop | null> {
  try {
    const { data } = await api.post(`${url}/find-shop`, { pageId })
    return data ? data : null
  } catch (e) {
    return null
  }
}

export default {
  getPageAccessToken,
  resetPageAccessToken,
  findCategories,
  findProduct,
  findProducts,
  findShop,
}
