import { Context } from 'koa'

import pageRepository from '../pkg/db/page'

async function findPage(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) {
    const page = await pageRepository.find(pageId)
    if (page) ctx.body = page
  }
}

export default {
  findPage,
}
