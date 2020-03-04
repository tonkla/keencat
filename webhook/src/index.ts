import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'
import dotenv from 'dotenv'

dotenv.config()

import msg from './pkg/messenger'
import { Message } from './pkg/messenger/typings/response'

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
  const { authorization } = ctx.headers
  if (!authorization || authorization !== process.env.WEBVIEW_TOKEN) {
    return (ctx.status = 401)
  }
  const { order } = ctx.request.body
  if (order) {
    const message: Message = {
      recipient: { id: order.customerId },
      messaging_type: 'response',
      message: { text: `Total Amount: ${order.totalAmount} THB.` },
    }
    await msg.send(order.pageId, message)
    return (ctx.status = 200)
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

const port = process.env.NODE_ENV === 'development' ? 8081 : 8080

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r.routes())
  .listen({ port }, () => console.log('🚀 Messenger Launched'))
