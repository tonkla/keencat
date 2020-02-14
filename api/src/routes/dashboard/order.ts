import { Context } from 'koa'

import orderRepository from '../../pkg/db/order'

async function findByShop(ctx: Context) {
  const { shopId, ownerId } = ctx.request.body
  if (!shopId) {
    ctx.status = 400
    return
  }
  const orders = await orderRepository.findByShop(shopId)
  if (orders.length > 0 && orders[0].ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = orders
}

export default {
  findByShop,
}
