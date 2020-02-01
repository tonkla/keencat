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

async function authorization(ctx: Context, next: Function) {
  const accessToken = process.env.API_ACCESS_TOKEN || ''
  const { authorization } = ctx.headers
  if (authorization && authorization == accessToken) await next()
  else ctx.status = 401
}

async function handleAPICall(ctx: Context) {
  const { cmd, pageId, categoryId } = ctx.request.body
  if (!cmd) ctx.body = ''
  if (cmd === 'getPageAccessToken') {
    ctx.body = await db.getPageAccessToken(pageId)
  } else if (cmd === 'findCategories') {
    ctx.body = await db.findCategories(pageId)
  } else if (cmd === 'findProducts') {
    ctx.body = await db.findProducts(pageId, categoryId)
  } else if (cmd === 'findShop') {
    ctx.body = await db.findShop(pageId)
  } else {
    ctx.body = ''
  }
}

async function handleLogin(ctx: Context) {
  const token = await auth.logIn(ctx.request.body)
  if (token) ctx.body = token
}

const r = new Router()
r.post('/', handleAPICall)
r.post('/login', handleLogin)
r.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(authorization)
  .use(r.routes())
  .listen({ port: 8080 }, () => console.log('🚀 API Launched'))
