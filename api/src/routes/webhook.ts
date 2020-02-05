import { Context } from 'koa'

import categoryRepository from '../pkg/db/category'
import pageRepository from '../pkg/db/page'
import productRepository from '../pkg/db/product'

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

async function findProducts(ctx: Context) {
  const { categoryId, pageId } = ctx.request.body
  if (categoryId) ctx.body = await productRepository.findByCategory(categoryId)
  else if (pageId) ctx.body = await productRepository.findByPage(pageId)
}

export default {
  findCategories,
  findPage,
  findProducts,
}
