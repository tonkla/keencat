import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'
import dotenv from 'dotenv'

dotenv.config()

import logging from './pkg/logging'
import utils from './pkg/utils'
import msg from './pkg/messenger'

async function handleGetMessenger(ctx: Context) {
  ctx.body = msg.verify({
    mode: ctx.query['hub.mode'],
    verifyToken: ctx.query['hub.verify_token'],
    challenge: ctx.query['hub.challenge'],
  })
}

async function handlePostMessenger(ctx: Context) {
  await msg.reply(ctx.request.body)
  ctx.status = 200
}

async function handleGetWebview(ctx: Context) {
  const referer = ctx.get('Referer')
  if (referer) {
    if (referer.indexOf('www.messenger.com') >= 0) {
      ctx.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/')
    } else if (referer.indexOf('www.facebook.com') >= 0) {
      ctx.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/')
    }
    ctx.sendFile('public/options.html', { root: __dirname })
  }
}

async function handlePostWebview(ctx: Context) {
  await logging.info('Enter handlePostWebview')
  const { hmac, pageid: pageId, customerid: customerId } = ctx.headers
  await logging.debug({ hmac, pageId, customerId })
  if (hmac && pageId && customerId) {
    if (hmac !== utils.createHmac(pageId, customerId)) {
      return (ctx.status = 401)
    }
    const { customer, items } = ctx.request.body
    await logging.debug({ customer, items })
    if (customer && items) {
      await msg.handlePostbackFromWebview(pageId, customer, items)
      return (ctx.status = 200)
    }
  }
  ctx.status = 400
}

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    // TODO: log
    ctx.status = 500
  }
}

const r = new Router()
r.get('/msg', handleGetMessenger)
r.post('/msg', handlePostMessenger)
r.get('/webview', handleGetWebview)
r.post('/webview', handlePostWebview)
r.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

const port = utils.isDev() ? 8081 : 8080

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r.routes())
  .listen({ port }, async () => await logging.notice('🚀 Messenger Launched'))
