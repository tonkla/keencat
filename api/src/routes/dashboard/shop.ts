import { Context } from 'koa'

import shopRepository from '../../pkg/db/shop'

async function findByOwner(ctx: Context) {
  const { ownerId } = ctx.request.body
  if (ownerId) ctx.body = await shopRepository.findByOwner(ownerId)
}

function isValid(ctx: Context): boolean {
  const { shop, ownerId } = ctx.request.body
  if (!shop) {
    ctx.status = 400
    return false
  }
  if (!ownerId || ownerId !== shop.ownerId) {
    ctx.status = 401
    return false
  }
  return true
}

async function create(ctx: Context) {
  if (!isValid(ctx)) return
  const { shop } = ctx.request.body
  if (await shopRepository.create(shop)) ctx.status = 200
}

async function update(ctx: Context) {
  if (!isValid(ctx)) return
  const { shop } = ctx.request.body
  if (await shopRepository.update(shop)) ctx.status = 200
}

async function remove(ctx: Context) {
  if (!isValid(ctx)) return
  const { shop } = ctx.request.body
  if (await shopRepository.remove(shop)) ctx.status = 200
}

export default {
  findByOwner,
  create,
  update,
  remove,
}
