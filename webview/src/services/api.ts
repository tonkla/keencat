import axios from 'axios'

import { Category, Customer, Product, Session, Shop } from '../typings'

async function call(headers: Session, path: string, params: any) {
  try {
    const url = process.env.REACT_APP_API_URL
    if (url) return await axios.create({ headers }).post(`${url}/${path}`, params)
    return null
  } catch (e) {
    return null
  }
}

async function findCategories(headers: Session, shopId: string): Promise<Category[]> {
  const resp = await call(headers, 'find-categories', { shopId })
  return resp && resp.data ? resp.data : []
}

async function findCategory(headers: Session, id: string): Promise<Category | null> {
  const resp = await call(headers, 'find-category', { id })
  return resp && resp.data ? resp.data : null
}

async function findCustomer(headers: Session, id: string): Promise<Customer | null> {
  const resp = await call(headers, 'find-customer', { id })
  return resp && resp.data ? resp.data : null
}

async function findProduct(headers: Session, id: string): Promise<Product | null> {
  const resp = await call(headers, 'find-product', { id })
  return resp && resp.data ? resp.data : null
}

async function findProducts(headers: Session, categoryId: string): Promise<Product[]> {
  const resp = await call(headers, 'find-products', { categoryId })
  return resp && resp.data ? resp.data : []
}

async function findShop(headers: Session, id: string): Promise<Shop | null> {
  const resp = await call(headers, 'find-shop', { id })
  return resp && resp.data ? resp.data : null
}

async function updateCustomer(headers: Session, customer: Customer): Promise<boolean> {
  const resp = await call(headers, 'update-customer', { customer })
  return resp !== null && resp.status === 200
}

export default {
  findCategories,
  findCategory,
  findCustomer,
  findProduct,
  findProducts,
  findShop,
  updateCustomer,
}
