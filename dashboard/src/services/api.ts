import Category from '../typings/category'
import Product from '../typings/product'
import Shop from '../typings/shop'
import User from '../typings/user'

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

async function getUser(id: string): Promise<User | null> {
  return null
}

async function getUserByFacebookId(fbId: string): Promise<User | null> {
  return null
}

async function createUser(user: User): Promise<boolean> {
  return false
}

export default {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  getShops,
  createShop,
  getUser,
  getUserByFacebookId,
  createUser,
}
