import { Context } from 'koa'

import categoryRepository from '../../pkg/db/category'
import customerRepository from '../../pkg/db/customer'
import orderRepository from '../../pkg/db/order'
import pageRepository from '../../pkg/db/page'
import productRepository from '../../pkg/db/product'
import shopRepository from '../../pkg/db/shop'

async function findCategories(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) ctx.body = await categoryRepository.findByPage(pageId)
}

async function findCustomer(ctx: Context) {
  const { customerId } = ctx.request.body
  if (customerId) {
    const customer = await customerRepository.find(customerId)
    if (customer) ctx.body = customer
  }
}

async function findPage(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) {
    const page = await pageRepository.find(pageId)
    if (page) ctx.body = page
  }
}

async function findProduct(ctx: Context) {
  const { pageId, productId } = ctx.request.body
  if (pageId && productId) {
    const product = await productRepository.find(productId)
    if (product) {
      if (product.pageId !== pageId) ctx.status = 401
      else ctx.body = product
    }
  }
}

async function findProducts(ctx: Context) {
  const { categoryId, pageId } = ctx.request.body
  if (categoryId) ctx.body = await productRepository.findByCategory(categoryId)
  else if (pageId) ctx.body = await productRepository.findByPage(pageId)
}

async function findShop(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) {
    const shop = await shopRepository.findByPage(pageId)
    if (shop) ctx.body = shop
  }
}

async function createOrder(ctx: Context) {
  const { order } = ctx.request.body
  if (order && order.pageId && order.customerId) {
    const orderId = await orderRepository.create(order)
    if (orderId) ctx.body = orderId
  }
}

async function updateOrder(ctx: Context) {
  const { order } = ctx.request.body
  if (order && order.pageId && order.customerId) {
    if (await orderRepository.updateAttachment(order)) ctx.status = 200
  }
}

export default {
  findCategories,
  findCustomer,
  findPage,
  findProduct,
  findProducts,
  findShop,
  createOrder,
  updateOrder,
}
