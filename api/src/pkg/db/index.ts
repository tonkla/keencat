import admin from '../firebase'
import { Category, Page, Product, Shop } from '../../typings'

async function findCategories(pageId: string): Promise<Category[]> {
  return []
}

async function findProducts(pageId: string, categoryId?: string): Promise<Product[]> {
  return []
}

async function findShop(pageId: string): Promise<Shop | null> {
  return null
}

async function findPage(pageId: string): Promise<Page | null> {
  try {
    const doc = await admin
      .firestore()
      .collection('fbpages')
      .doc(pageId)
      .get()
    if (doc.exists) return doc.data() as Page
    return null
  } catch (e) {
    return null
  }
}

export default {
  findCategories,
  findProducts,
  findShop,
  findPage,
}
