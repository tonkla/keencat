import { Context } from 'koa'

import categoryRepository from '../../pkg/db/category'

async function findByShop(ctx: Context) {
  const { shopId } = ctx.request.body
  if (shopId) ctx.body = await categoryRepository.findByShop(shopId)
}

async function create(ctx: Context) {
  const { category } = ctx.request.body
  if (category && (await categoryRepository.create(category))) ctx.status = 200
}

export default {
  findByShop,
  create,
}
