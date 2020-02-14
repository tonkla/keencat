import dotenv from 'dotenv'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-tree-router'

dotenv.config()

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
  ctx.body = 'EVENT_RECEIVED'
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
r.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

new Koa()
  .use(bodyParser())
  .use(handleError)
  .use(r.routes())
  .listen({ port: 8081 }, () => console.log('🚀 Messenger Launched'))
