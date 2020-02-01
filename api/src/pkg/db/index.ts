import admin from '../firebase'
import { Category, Product, Shop } from '../../typings'

async function findCategories(pageId: string): Promise<Category[]> {
  return []
}

async function findProducts(pageId: string, categoryId?: string): Promise<Product[]> {
  return []
}

async function findShop(pageId: string): Promise<Shop | null> {
  return null
}

async function getPageAccessToken(pageId: string): Promise<string | null> {
  try {
    const doc = (
      await admin
        .firestore()
        .collection('fbpages')
        .where('id', '==', pageId)
        .get()
    ).docs[0]
    if (doc.exists) {
      const page: any = doc.data()
      return page.pageAccessToken
    }
    return null
  } catch (e) {
    return null
  }
}

export default {
  findCategories,
  findProducts,
  findShop,
  getPageAccessToken,
}
