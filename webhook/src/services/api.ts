import dotenv from 'dotenv'

import { Category, Product } from '../typings/common'

dotenv.config()

async function getPageAccessToken(pageId: string): Promise<string> {
  return ''
}

async function getCategories(pageId: string): Promise<Category[]> {
  return []
}

async function getProducts(pageId: string, categoryId?: string): Promise<Product[]> {
  return []
}

async function resetPageAccessToken(pageId: string): Promise<boolean> {
  return false
}

export default {
  getCategories,
  getPageAccessToken,
  getProducts,
  resetPageAccessToken,
}
