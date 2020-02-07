import { Context } from 'koa'

import shopRepository from '../../pkg/db/shop'

async function findByOwner(ctx: Context) {
  const { ownerId } = ctx.request.body
  if (ownerId) ctx.body = await shopRepository.findByOwner(ownerId)
}

async function create(ctx: Context) {
  const { shop, ownerId } = ctx.request.body
  if (!shop) {
    ctx.status = 400
    return
  }
  if (!ownerId || ownerId !== shop.ownerId) {
    ctx.status = 401
    return
  }
  if (await shopRepository.create(shop)) ctx.status = 200
}

async function update(ctx: Context) {
  const { shop, ownerId } = ctx.request.body
  if (!shop) {
    ctx.status = 400
    return
  }
  if (!ownerId || ownerId !== shop.ownerId) {
    ctx.status = 401
    return
  }
  if (await shopRepository.update(shop)) ctx.status = 200
}

export default {
  findByOwner,
  create,
  update,
}
