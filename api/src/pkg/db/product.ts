import admin from '../firebase/index'
import { Product } from '../../typings'

const db = admin.firestore()

async function find(id: string) {}

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

async function update(product: Product) {}

async function remove(product: Product) {}

export default {
  find,
  findByCategory,
  findByPage,
  create,
  update,
  remove,
}
