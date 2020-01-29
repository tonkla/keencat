import { Category, Product, Shop, User } from '../../typings'

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

async function ping() {
  const token = localStorage.getItem('accessToken')
  console.log(token)
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
  ping,
}
