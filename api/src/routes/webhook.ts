import { Context } from 'koa'

import pageRepository from '../pkg/db/page'

async function findPage(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) ctx.body = await pageRepository.find(pageId)
  else ctx.status = 400
}

export default {
  findPage,
}
