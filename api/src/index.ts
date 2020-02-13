import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'
import dotenv from 'dotenv'

dotenv.config()

import auth from './pkg/auth'
import { category, page, product, shop } from './routes/dashboard'
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
  if (path.indexOf('/webhook') === 0) {
    const accessToken = process.env.API_ACCESS_TOKEN || ''
    const { authorization } = ctx.headers
    if (authorization && authorization === accessToken) return await next()
  } else if (path.indexOf('/dashboard') === 0) {
    const { authorization } = ctx.headers
    if (authorization) {
      const uid = await auth.authorize(authorization)
      if (uid) {
        // Verify owner of the incoming data
        const { ownerId } = ctx.request.body
        if (ownerId && ownerId !== uid) {
          ctx.status = 401
          return
        }
        // Pass uid to verify owner on object level
        else ctx.request.body = { ...ctx.request.body, ownerId: uid }

        await next()

        return
      }
    }
  }
  ctx.status = 401
}

const r1 = new Router()
r1.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

const r2 = new Router()
r2.post('/find-categories', webhook.findCategories)
r2.post('/find-products', webhook.findProducts)
r2.post('/find-page', webhook.findPage)

const r3 = new Router()
r3.post('/find-category', category.find)
r3.post('/find-categories', category.findByIds)
r3.post('/find-product', product.find)
r3.post('/find-products', product.findByIds)
r3.post('/find-shops', shop.findByOwner)
r3.post('/create-category', category.create)
r3.post('/create-page', page.create)
r3.post('/create-product', product.create)
r3.post('/create-shop', shop.create)
r3.post('/update-category', category.update)
r3.post('/update-product', product.update)
r3.post('/update-shop', shop.update)
r3.post('/delete-category', category.remove)
r3.post('/delete-categories', category.removeByShop)
r3.post('/delete-product', product.remove)
r3.post('/delete-products', product.removeByCategory)
r3.post('/delete-shop', shop.remove)

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r1.routes())
  .use(authorize)
  .use(r2.mount('/webhook'))
  .use(r3.mount('/dashboard'))
  .listen({ port: 8080 }, () => console.log('🚀 API Launched'))
