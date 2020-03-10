import { Context } from 'koa'

import orderRepository from '../../pkg/db/order'

async function find(ctx: Context) {
  const { id, ownerId } = ctx.request.body
  if (!id) ctx.status = 400
  else {
    const order = await orderRepository.find(id)
    if (order) {
      if (order.ownerId !== ownerId) ctx.status = 401
      else ctx.body = order
    }
  }
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

function isValid(ctx: Context): boolean {
  const { order, ownerId } = ctx.request.body
  if (!order) {
    ctx.status = 400
    return false
  }
  if (!ownerId || ownerId !== order.ownerId) {
    ctx.status = 401
    return false
  }
  return true
}

async function update(ctx: Context) {
  if (!isValid(ctx)) return
  const { order } = ctx.request.body
  if (await orderRepository.update(order)) return (ctx.status = 200)
  return 500
}

export default {
  find,
  findByShop,
  update,
}
