import firebase from 'firebase/app'
import 'firebase/firestore'

import { Category, Product, Shop, User } from '../../typings'

const firestore = firebase.firestore()

async function getCategories(shop: Shop): Promise<Category[]> {
  return []
}

async function createCategory(category: Category) {
  //
}

async function getProducts(category: Category): Promise<Product[]> {
  return []
}

async function createProduct(product: Product) {
  //
}

async function getShops(owner: string): Promise<Shop[]> {
  return []
}

async function createShop(shop: Shop) {
  //
}

async function getUserByFirebaseId(fid: string): Promise<User | null> {
  try {
    const doc = await firestore
      .collection('users')
      .doc(fid)
      .get()
    const d: any = doc.data()
    return doc.exists ? { id: d.id, ...d } : null
  } catch (e) {
    return null
  }
}

async function createUser(user: User): Promise<boolean> {
  if (!user.firebaseId) return false
  try {
    await firestore
      .collection('users')
      .doc(user.firebaseId)
      .set(user)
    return true
  } catch (e) {
    return false
  }
}

export default {
  createCategory,
  getCategories,

  createProduct,
  getProducts,

  createShop,
  getShops,

  createUser,
  getUserByFirebaseId,
}
