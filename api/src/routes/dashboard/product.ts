import { Context } from 'koa'

import productRepository from '../../pkg/db/product'
import { Product } from '../../typings/product'

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
  if (!ownerId || ownerId !== product.owner.firebaseId) {
    ctx.status = 401
    return
  }
  const { owner, ...input } = product
  const _product: Product = { ...input, ownerId: input.owner.firebaseId }
  if (await productRepository.create(_product)) ctx.status = 200
}

export default {
  findByCategory,
  create,
}
