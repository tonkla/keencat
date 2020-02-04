import { Context } from 'koa'

import shopRepository from '../../pkg/db/shop'

async function findByOwner(ctx: Context) {
  const { owner } = ctx.request.body
  if (owner) {
    ctx.body = await shopRepository.findByOwner(owner)
    ctx.status = 200
  }
}

async function create(ctx: Context) {
  const { shop } = ctx.request.body
  if (shop && (await shopRepository.create(shop))) ctx.status = 200
}

export default {
  findByOwner,
  create,
}
