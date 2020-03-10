import crypto from 'crypto'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'
import dotenv from 'dotenv'

dotenv.config()

import auth from './pkg/auth'
import logging from './pkg/logging'
import { category, customer, order, page, product, shop } from './routes/dashboard'
import webhook from './routes/webhook'
import webview from './routes/webview'

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    await logging.error(e)
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
  }
  // Webview
  else if (path.indexOf('/webview') === 0) {
    const key = process.env.PRIVATE_KEY
    const { hmac, pageid: pageId, customerid: customerId } = ctx.headers
    if (key && hmac && pageId && customerId) {
      const _hmac = crypto
        .createHmac('sha256', key)
        .update(JSON.stringify({ pageId, customerId }))
        .digest('hex')
      if (hmac === _hmac) return await next()
    }
  }
  // Dashboard
  else if (path.indexOf('/dashboard') === 0) {
    const { authorization } = ctx.headers
    if (authorization) {
      const uid = await auth.authorize(authorization)
      if (uid) {
        // Verify owner of the incoming data
        const { ownerId } = ctx.request.body
        if (ownerId && ownerId !== uid) return (ctx.status = 401)
        // Pass uid to verify owner at object level
        else ctx.request.body = { ...ctx.request.body, ownerId: uid }
        return await next()
      }
    }
  }
  ctx.status = 401
}

const r1 = new Router()
r1.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

const r2 = new Router()
r2.post('/find-categories', webhook.findCategories)
r2.post('/find-customer', webhook.findCustomer)
r2.post('/find-page', webhook.findPage)
r2.post('/find-product', webhook.findProduct)
r2.post('/find-products', webhook.findProducts)
r2.post('/find-shop', webhook.findShop)
r2.post('/create-order', webhook.createOrder)
r2.post('/update-order', webhook.updateOrder)

const r3 = new Router()
r3.post('/find-categories', webview.findCategories)
r3.post('/find-customer', webview.findCustomer)
r3.post('/find-product', webview.findProduct)
r3.post('/find-products', webview.findProducts)
r3.post('/find-shop', webview.findShop)
r3.post('/update-customer', webview.updateCustomer)

const r4 = new Router()
r4.post('/find-category', category.find)
r4.post('/find-categories', category.findByIds)
r4.post('/find-customer', customer.find)
r4.post('/find-order', order.find)
r4.post('/find-orders', order.findByShop)
r4.post('/find-product', product.find)
r4.post('/find-products', product.findByIds)
r4.post('/find-shops', shop.findByOwner)
r4.post('/create-category', category.create)
r4.post('/create-page', page.create)
r4.post('/create-product', product.create)
r4.post('/create-shop', shop.create)
r4.post('/update-category', category.update)
r4.post('/update-order', order.update)
r4.post('/update-product', product.update)
r4.post('/update-shop', shop.update)
r4.post('/delete-category', category.remove)
r4.post('/delete-categories', category.removeByShop)
r4.post('/delete-page', page.remove)
r4.post('/delete-product', product.remove)
r4.post('/delete-products', product.removeByCategory)
r4.post('/delete-shop', shop.remove)

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r1.routes())
  .use(authorize)
  .use(r2.mount('/webhook'))
  .use(r3.mount('/webview'))
  .use(r4.mount('/dashboard'))
  .listen({ port: 8080 }, async () => await logging.notice('🚀 API Launched'))
