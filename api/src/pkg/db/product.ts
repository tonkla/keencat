import admin from '../firebase/index'
import { Product } from '../../typings'

const db = admin.firestore()

async function find(id: string): Promise<Product | null> {
  try {
    const doc = await db
      .collection('products')
      .doc(id)
      .get()
    return doc.exists ? (doc.data() as Product) : null
  } catch (e) {
    return null
  }
}

async function findByIds(ids: string[]): Promise<Product[]> {
  try {
    const products = await Promise.all(ids.map(id => find(id)))
    return products.filter((p): p is Product => p !== null)
  } catch (e) {
    return []
  }
}

async function findByCategory(categoryId: string): Promise<Product[]> {
  try {
    const products: Product[] = []
    const docs = await db
      .collection('products')
      .where('categoryId', '==', categoryId)
      .get()
    docs.forEach(d => {
      products.push(d.data() as Product)
    })
    return products
  } catch (e) {
    return []
  }
}

async function findByPage(pageId: string): Promise<Product[]> {
  try {
    const products: Product[] = []
    const docs = await db
      .collection('products')
      .where('pageId', '==', pageId)
      .get()
    docs.forEach(d => {
      products.push(d.data() as Product)
    })
    return products
  } catch (e) {
    return []
  }
}

async function create(product: Product): Promise<boolean> {
  try {
    await db
      .collection('products')
      .doc(product.id)
      .set(product)
    return true
  } catch (e) {
    return false
  }
}

async function update(product: Product): Promise<boolean> {
  try {
    await db
      .collection('products')
      .doc(product.id)
      .set(product)
    return true
  } catch (e) {
    return false
  }
}

async function remove(product: Product): Promise<boolean> {
  try {
    await db
      .collection('products')
      .doc(product.id)
      .delete()
    return true
  } catch (e) {
    return false
  }
}

export default {
  find,
  findByIds,
  findByCategory,
  findByPage,
  create,
  update,
  remove,
}
