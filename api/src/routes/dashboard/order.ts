import { Context } from 'koa'

import orderRepository from '../../pkg/db/order'

async function find(ctx: Context) {
  const { id, ownerId } = ctx.request.body
  if (!id) {
    ctx.status = 400
    return
  }
  const order = await orderRepository.find(id)
  if (order && order.ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = order
}

async function findByShop(ctx: Context) {
  const { shopId, createdDate, ownerId } = ctx.request.body
  if (!shopId) {
    ctx.status = 400
    return
  }
  const orders = await orderRepository.findByShop(shopId, createdDate)
  if (orders.length > 0 && orders[0].ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = orders
}

export default {
  find,
  findByShop,
}
