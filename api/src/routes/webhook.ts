import { Context } from 'koa'

import categoryRepository from '../pkg/db/category'
import pageRepository from '../pkg/db/page'

async function findCategoriesByPage(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) ctx.body = await categoryRepository.findByPage(pageId)
}

async function findPage(ctx: Context) {
  const { pageId } = ctx.request.body
  if (pageId) {
    const page = await pageRepository.find(pageId)
    if (page) ctx.body = page
  }
}

export default {
  findCategoriesByPage,
  findPage,
}
