import admin from '../firebase/index'
import { Category, Shop } from '../../typings'

const db = admin.firestore()

async function find(id: string): Promise<Category | null> {
  try {
    const doc = await db
      .collection('categories')
      .doc(id)
      .get()
    return doc.exists ? (doc.data() as Category) : null
  } catch (e) {
    return null
  }
}

async function findByIds(ids: string[]): Promise<Category[]> {
  try {
    const categories = await Promise.all(ids.map(id => find(id)))
    return categories.filter((c): c is Category => c !== null)
  } catch (e) {
    return []
  }
}

async function findByPage(pageId: string): Promise<Category[]> {
  try {
    const categories: Category[] = []
    const docs = await db
      .collection('categories')
      .where('pageId', '==', pageId)
      .get()
    docs.forEach(d => {
      categories.push(d.data() as Category)
    })
    return categories
  } catch (e) {
    return []
  }
}

async function findByShop(shopId: string): Promise<Category[]> {
  try {
    const categories: Category[] = []
    const docs = await db
      .collection('categories')
      .where('shopId', '==', shopId)
      .get()
    docs.forEach(d => {
      categories.push(d.data() as Category)
    })
    return categories
  } catch (e) {
    return []
  }
}

async function create(category: Category): Promise<boolean> {
  try {
    await db
      .collection('categories')
      .doc(category.id)
      .set(category)
    return true
  } catch (e) {
    return false
  }
}

async function update(category: Category): Promise<boolean> {
  try {
    await db
      .collection('categories')
      .doc(category.id)
      .set(category)
    return true
  } catch (e) {
    return false
  }
}

async function remove(category: Category): Promise<boolean> {
  try {
    await db
      .collection('categories')
      .doc(category.id)
      .delete()
    return true
  } catch (e) {
    return false
  }
}

async function removeByShop(shop: Shop): Promise<boolean> {
  try {
    shop.categoryIds.forEach(async id => {
      await db
        .collection('categories')
        .doc(id)
        .delete()
    })
    return true
  } catch (e) {
    return false
  }
}

export default {
  find,
  findByIds,
  findByPage,
  findByShop,
  create,
  update,
  remove,
  removeByShop,
}
