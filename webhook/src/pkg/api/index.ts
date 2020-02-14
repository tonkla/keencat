import axios from 'axios'
import dotenv from 'dotenv'

import { Category, Order, Page, Product, Shop } from '../../typings'

dotenv.config()
const accessToken = process.env.API_ACCESS_TOKEN || ''
const url =
  (process.env.NODE_ENV === 'development' ? process.env.API_URL_DEV : process.env.API_URL) || ''

const redis = new Map<string, Page>()

const api = axios.create({ headers: { authorization: accessToken } })

async function getPageAccessToken(pageId: string): Promise<string | null> {
  try {
    const page = redis.get(pageId)
    if (page) {
      return page.accessToken
    } else {
      const { data: page } = await api.post(`${url}/find-page`, { pageId })
      if (page && page.accessToken) {
        redis.set(pageId, page)
        return page.accessToken
      }
      return null
    }
  } catch (e) {
    return null
  }
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

async function createOrder(order: Order) {
  try {
    await api.post(`${url}/create-order`, order)
  } catch (e) {}
}

async function updateOrder(order: Order) {
  try {
    await api.post(`${url}/update-order`, order)
  } catch (e) {}
}

export default {
  getPageAccessToken,
  findCategories,
  findProduct,
  findProducts,
  findShop,
  createOrder,
  updateOrder,
}
