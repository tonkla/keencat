import { Context } from 'koa'

import pageRepository from '../../pkg/db/page'

async function create(ctx: Context) {
  const { page } = ctx.request.body
  if (page && (await pageRepository.create(page))) ctx.status = 200
}

async function remove(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId && (await pageRepository.remove(pageId))) ctx.status = 200
}

export default {
  create,
  remove,
}
