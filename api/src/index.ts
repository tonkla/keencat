import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'
import dotenv from 'dotenv'

dotenv.config()

import auth from './pkg/auth'
import db from './pkg/db'

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    // TODO: log
    ctx.status = 500
  }
}

async function handleDashboardCall(ctx: Context) {
  const { authorization, uid } = ctx.headers
  if (authorization && auth.authorize(authorization, uid)) {
    const { cmd, pageId, categoryId } = ctx.request.body
    if (!cmd) ctx.body = ''
    if (cmd === 'hello') {
      ctx.body = 'world'
    } else if (cmd === 'findPage') {
      ctx.body = await db.findPage(pageId)
    } else if (cmd === 'findCategories') {
      ctx.body = await db.findCategories(pageId)
    } else if (cmd === 'findProducts') {
      ctx.body = await db.findProducts(pageId, categoryId)
    } else if (cmd === 'findShop') {
      ctx.body = await db.findShop(pageId)
    } else {
      ctx.status = 400
    }
  } else ctx.status = 401
}

async function handleWebhookCall(ctx: Context) {
  const accessToken = process.env.API_ACCESS_TOKEN || ''
  const { authorization } = ctx.headers
  if (authorization && authorization == accessToken) {
    const { cmd, pageId, categoryId } = ctx.request.body
    if (!cmd) ctx.body = ''
    if (cmd === 'findPage') {
      ctx.body = await db.findPage(pageId)
    } else if (cmd === 'findCategories') {
      ctx.body = await db.findCategories(pageId)
    } else if (cmd === 'findProducts') {
      ctx.body = await db.findProducts(pageId, categoryId)
    } else if (cmd === 'findShop') {
      ctx.body = await db.findShop(pageId)
    } else {
      ctx.status = 400
    }
  } else ctx.status = 401
}

const r = new Router()
r.post('/dashboard', handleDashboardCall)
r.post('/webhook', handleWebhookCall)
r.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r.routes())
  .listen({ port: 8080 }, () => console.log('🚀 API Launched'))
