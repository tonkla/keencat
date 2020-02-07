import { Context } from 'koa'

import productRepository from '../../pkg/db/product'

async function find(ctx: Context) {
  const { id, ownerId } = ctx.request.body
  if (!id) {
    ctx.status = 400
    return
  }
  const product = await productRepository.find(id)
  if (product && product.ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = product
}

async function findByIds(ctx: Context) {
  const { ids, ownerId } = ctx.request.body
  if (!ids || ids.length < 1) {
    ctx.status = 400
    return
  }
  const products = await productRepository.findByIds(ids)
  if (products.length > 0 && products[0].ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = products
}

async function findByCategory(ctx: Context) {
  const { categoryId, ownerId } = ctx.request.body
  if (!categoryId) {
    ctx.status = 400
    return
  }
  const products = await productRepository.findByCategory(categoryId)
  if (products.length > 0 && products[0].ownerId !== ownerId) {
    ctx.status = 401
    return
  }
  ctx.body = products
}

async function create(ctx: Context) {
  const { product, ownerId } = ctx.request.body
  if (!product) {
    ctx.status = 400
    return
  }
  if (!ownerId || ownerId !== product.ownerId) {
    ctx.status = 401
    return
  }
  if (await productRepository.create(product)) ctx.status = 200
}

async function update(ctx: Context) {
  const { product, ownerId } = ctx.request.body
  if (!product) {
    ctx.status = 400
    return
  }
  if (!ownerId || ownerId !== product.ownerId) {
    ctx.status = 401
    return
  }
  if (await productRepository.update(product)) ctx.status = 200
}

export default {
  find,
  findByIds,
  findByCategory,
  create,
  update,
}
