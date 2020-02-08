import { Context } from 'koa'

import categoryRepository from '../../pkg/db/category'

async function find(ctx: Context) {
  const { id, ownerId } = ctx.request.body
  if (!id) {
    ctx.status = 400
    return
  }
  const category = await categoryRepository.find(id)
  if (category && category.ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = category
}

async function findByIds(ctx: Context) {
  const { ids, ownerId } = ctx.request.body
  if (!ids || ids.length < 1) {
    ctx.status = 400
    return
  }
  const categories = await categoryRepository.findByIds(ids)
  if (categories.length > 0 && categories[0].ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = categories
}

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

function isValid(ctx: Context): boolean {
  const { category, ownerId } = ctx.request.body
  if (!category) {
    ctx.status = 400
    return false
  }
  if (!ownerId || ownerId !== category.ownerId) {
    ctx.status = 401
    return false
  }
  return true
}

async function create(ctx: Context) {
  if (!isValid(ctx)) return
  const { category } = ctx.request.body
  if (await categoryRepository.create(category)) ctx.status = 200
}

async function update(ctx: Context) {
  if (!isValid(ctx)) return
  const { category } = ctx.request.body
  if (await categoryRepository.update(category)) ctx.status = 200
}

async function remove(ctx: Context) {
  if (!isValid(ctx)) return
  const { category } = ctx.request.body
  if (await categoryRepository.remove(category)) ctx.status = 200
}

export default {
  find,
  findByIds,
  findByShop,
  create,
  update,
  remove,
}
