import { Context } from 'koa'

import shopRepository from '../pkg/db/shop'

async function createShop(ctx: Context) {
  const { shop } = ctx.request.body
  if (shop) ctx.body = await shopRepository.create(shop)
  else ctx.status = 400
}

export default {
  createShop,
}
