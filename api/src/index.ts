import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'
import dotenv from 'dotenv'

dotenv.config()

import auth from './pkg/auth'
import dashboard from './routes/dashboard'
import webhook from './routes/webhook'

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    // TODO: log
    ctx.status = 500
  }
}

async function authorize(ctx: Context, next: Function) {
  if (ctx.request.method !== 'POST') return await next()

  const { path } = ctx.request
  if (path.indexOf('/dashboard') === 0) {
    const { authorization, uid } = ctx.headers
    if (authorization && auth.authorize(authorization, uid)) return await next()
  } else if (path.indexOf('/webhook') === 0) {
    const accessToken = process.env.API_ACCESS_TOKEN || ''
    const { authorization } = ctx.headers
    if (authorization && authorization === accessToken) return await next()
  }
  ctx.status = 401
}

const r1 = new Router()
r1.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

const r2 = new Router()
r2.post('/create-shop', dashboard.createShop)

const r3 = new Router()
r3.post('/find-page', webhook.findPage)

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r1.routes())
  .use(authorize)
  .use(r2.mount('/dashboard'))
  .use(r3.mount('/webhook'))
  .listen({ port: 8080 }, () => console.log('🚀 API Launched'))
