import axios from 'axios'

import { Category, Customer, Product, Session, Shop } from '../typings'

async function call(headers: Session, path: string, params: any) {
  try {
    const url = process.env.REACT_APP_API_URL
    if (url) return await axios.create({ headers }).post(`${url}/${path}`, params)
    return { data: null }
  } catch (e) {
    return { data: null }
  }
}

async function findCategories(headers: Session, shopId: string): Promise<Category[]> {
  const { data } = await call(headers, 'find-categories', { shopId })
  return data ? data : []
}

async function findCustomer(headers: Session, id: string): Promise<Customer | null> {
  const { data } = await call(headers, 'find-customer', { id })
  return data ? data : null
}

async function findProduct(headers: Session, id: string): Promise<Product | null> {
  const { data } = await call(headers, 'find-product', { id })
  return data ? data : null
}

async function findProducts(headers: Session, categoryId: string): Promise<Product[]> {
  const { data } = await call(headers, 'find-products', { categoryId })
  return data ? data : []
}

async function findShop(headers: Session, id: string): Promise<Shop | null> {
  const { data } = await call(headers, 'find-shop', { id })
  return data ? data : null
}

export default {
  findCategories,
  findCustomer,
  findProduct,
  findProducts,
  findShop,
}
