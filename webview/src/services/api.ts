import axios from 'axios'

import { Category, Product, RequestHeader, Shop } from '../typings'

async function call(headers: RequestHeader, path: string, params: any) {
  try {
    const url = process.env.REACT_APP_API_URL
    if (url) return await axios.create({ headers }).post(`${url}/${path}`, params)
    return { data: null }
  } catch (e) {
    return { data: null }
  }
}

async function findCategories(headers: RequestHeader, shopId: string): Promise<Category[]> {
  const { data } = await call(headers, 'find-categories', { shopId })
  return data ? data : []
}

async function findProduct(headers: RequestHeader, id: string): Promise<Product | null> {
  const { data } = await call(headers, 'find-product', { id })
  return data ? data : null
}

async function findProducts(headers: RequestHeader, categoryId: string): Promise<Product[]> {
  const { data } = await call(headers, 'find-products', { categoryId })
  return data ? data : []
}

async function findShop(headers: RequestHeader, id: string): Promise<Shop | null> {
  const { data } = await call(headers, 'find-shop', { id })
  return data ? data : null
}

export default {
  findCategories,
  findProduct,
  findProducts,
  findShop,
}
