import { Context } from 'koa'

import shopRepository from '../../pkg/db/shop'
import { Shop } from '../../typings/shop'

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
  if (!ownerId || ownerId !== shop.owner.firebaseId) {
    ctx.status = 401
    return
  }
  const { owner, ...input } = shop
  const _shop: Shop = { ...input, ownerId: input.owner.firebaseId }
  if (await shopRepository.create(_shop)) ctx.status = 200
}

export default {
  findByOwner,
  create,
}
