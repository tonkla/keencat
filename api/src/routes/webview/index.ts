import { Context } from 'koa'

import categoryRepository from '../../pkg/db/category'
import productRepository from '../../pkg/db/product'
import shopRepository from '../../pkg/db/shop'

async function findCategories(ctx: Context) {
  const { shopId } = ctx.request.body
  if (shopId) {
    const categories = await categoryRepository.findByShop(shopId)
    ctx.body = categories.filter(c => c.productIds.length > 0)
  }
}

async function findProduct(ctx: Context) {
  const { id } = ctx.request.body
  if (id) {
    const product = await productRepository.find(id)
    if (product && product.isActive && product.quantity > 0) ctx.body = product
  }
}

async function findProducts(ctx: Context) {
  const { categoryId } = ctx.request.body
  if (categoryId) {
    const products = await productRepository.findByCategory(categoryId)
    ctx.body = products.filter(p => p.isActive && p.quantity > 0)
  }
}

async function findShop(ctx: Context) {
  const { id } = ctx.request.body
  if (id) {
    const shop = await shopRepository.find(id)
    if (shop && shop.isActive) ctx.body = shop
  }
}

export default {
  findCategories,
  findProduct,
  findProducts,
  findShop,
}
