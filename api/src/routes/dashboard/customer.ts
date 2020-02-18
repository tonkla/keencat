import { Context } from 'koa'

import customerRepository from '../../pkg/db/customer'

async function find(ctx: Context) {
  const { id } = ctx.request.body
  if (!id) ctx.status = 400
  else {
    const order = await customerRepository.find(id)
    if (order) ctx.body = order
  }
}

export default {
  find,
}
