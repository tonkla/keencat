import { Context } from 'koa'

import categoryRepository from '../../pkg/db/category'
import { Category } from '../../typings/category'

async function findByShop(ctx: Context) {
  const { shopId, ownerId } = ctx.request.body
  if (!shopId) {
    ctx.status = 400
    return
  }
  const categories = await categoryRepository.findByShop(shopId)
  if (categories.length > 0 && categories[0].ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = categories
}

async function create(ctx: Context) {
  const { category, ownerId } = ctx.request.body
  if (!category) {
    ctx.status = 400
    return
  }
  if (!ownerId || ownerId !== category.owner.firebaseId) {
    ctx.status = 401
    return
  }
  const { owner, ...input } = category
  const _category: Category = { ...input, ownerId: input.owner.firebaseId }
  if (await categoryRepository.create(_category)) ctx.status = 200
}

export default {
  findByShop,
  create,
}
