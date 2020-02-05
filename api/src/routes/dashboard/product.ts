import { Context } from 'koa'

import productRepository from '../../pkg/db/product'

async function findByCategory(ctx: Context) {
  const { categoryId } = ctx.request.body
  if (categoryId) ctx.body = await productRepository.findByCategory(categoryId)
}

async function create(ctx: Context) {
  const { product } = ctx.request.body
  if (product && (await productRepository.create(product))) ctx.status = 200
}

export default {
  findByCategory,
  create,
}
