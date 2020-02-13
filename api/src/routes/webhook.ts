import { Context } from 'koa'

import categoryRepository from '../pkg/db/category'
import pageRepository from '../pkg/db/page'
import productRepository from '../pkg/db/product'
import shopRepository from '../pkg/db/shop'

async function findCategories(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) ctx.body = await categoryRepository.findByPage(pageId)
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

export default {
  findCategories,
  findPage,
  findProduct,
  findProducts,
  findShop,
}
