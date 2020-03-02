import axios from 'axios'

import { Category, Product, Shop } from '../typings'

async function call(path: string, params: any) {
  try {
    const url = process.env.REACT_APP_API_URL || ''
    const authorization = process.env.REACT_APP_ACCESS_TOKEN || ''
    return await axios.create({ headers: { authorization } }).post(`${url}/${path}`, params)
  } catch (e) {
    return { data: null }
  }
}

async function findCategories(shopId: string): Promise<Category[]> {
  const { data } = await call('find-categories', { shopId })
  return data ? data : null
}

async function findProduct(id: string): Promise<Product | null> {
  const { data } = await call('find-product', { id })
  return data ? data : []
}

async function findProducts(categoryId: string): Promise<Product[]> {
  const { data } = await call('find-products', { categoryId })
  return data ? data : []
}

async function findShop(id: string): Promise<Shop | null> {
  const { data } = await call('find-shop', { id })
  return data ? data : []
}

export default {
  findCategories,
  findProduct,
  findProducts,
  findShop,
}
