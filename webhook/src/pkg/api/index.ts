import axios from 'axios'
import dotenv from 'dotenv'

import cache from './cache'
import { Category, Customer, Order, Page, Product, Shop } from '../../typings'

dotenv.config()
const accessToken = process.env.API_ACCESS_TOKEN || ''
const url =
  (process.env.NODE_ENV === 'development' ? process.env.API_URL_DEV : process.env.API_URL) || ''

const api = axios.create({ headers: { authorization: accessToken } })

async function findPage(pageId: string): Promise<Page | null> {
  try {
    const page = cache.getPage(pageId)
    if (page) return page
    else {
      const { data: page } = await api.post(`${url}/find-page`, { pageId })
      if (page) {
        cache.setPage(pageId, page)
        return page
      }
      return null
    }
  } catch (e) {
    return null
  }
}

async function findShop(pageId: string): Promise<Shop | null> {
  try {
    const shop = cache.getShop(pageId)
    if (shop) return shop
    else {
      const { data: shop } = await api.post(`${url}/find-shop`, { pageId })
      if (shop) {
        cache.setShop(pageId, shop)
        return shop
      }
      return null
    }
  } catch (e) {
    return null
  }
}

async function findCustomer(customerId: string): Promise<Customer | null> {
  try {
    const customer = cache.getCustomer(customerId)
    if (customer) return customer
    else {
      const { data: customer } = await api.post(`${url}/find-customer`, { customerId })
      if (customer) {
        cache.setCustomer(customerId, customer)
        return customer
      }
    }
    return null
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

async function createOrder(order: Order): Promise<string | null> {
  try {
    const { data: orderId } = await api.post(`${url}/create-order`, order)
    return orderId ? orderId : null
  } catch (e) {
    return null
  }
}

async function updateOrder(order: Order): Promise<boolean> {
  try {
    const resp = await api.post(`${url}/update-order`, order)
    return resp.status === 200
  } catch (e) {
    return false
  }
}

export default {
  findPage,
  findShop,
  findCustomer,
  findCategories,
  findProduct,
  findProducts,
  createOrder,
  updateOrder,
}
