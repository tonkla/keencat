import Category from '../../typings/category'
import Product from '../../typings/product'
import Shop from '../../typings/shop'

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

export default {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  getShops,
  createShop,
}
