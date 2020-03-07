import { Context } from 'koa'

import categoryRepository from '../../pkg/db/category'
import customerRepository from '../../pkg/db/customer'
import productRepository from '../../pkg/db/product'
import shopRepository from '../../pkg/db/shop'

async function findCategories(ctx: Context) {
  const { shopId } = ctx.request.body
  if (shopId) {
    const categories = await categoryRepository.findByShop(shopId)
    ctx.body = categories.filter(c => c.productIds.length > 0)
  }
}

async function findCustomer(ctx: Context) {
  const { id } = ctx.request.body
  if (id) {
    const customer = await customerRepository.find(id)
    ctx.body = customer ? customer : null
  }
}

async function findProduct(ctx: Context) {
  const { id } = ctx.request.body
  if (id) {
    const product = await productRepository.find(id)
    ctx.body = product && product.isActive && product.quantity > 0 ? product : null
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
    ctx.body = shop && shop.isActive ? shop : null
  }
}

async function updateCustomer(ctx: Context) {
  const { customer } = ctx.request.body
  if (customer && customer.id) {
    if (await customerRepository.update(customer)) ctx.status = 200
  }
}

export default {
  findCategories,
  findCustomer,
  findProduct,
  findProducts,
  findShop,
  updateCustomer,
}
