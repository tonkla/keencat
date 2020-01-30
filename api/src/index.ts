import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import Router from 'koa-tree-router'

import auth from './pkg/auth'

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    // TODO: log
    ctx.status = 500
  }
}

async function handleLogin(ctx: Context) {
  const token = await auth.logIn(ctx.request.body)
  if (token) ctx.body = token
}

const r = new Router()
r.post('/login', handleLogin)
r.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

new Koa()
  .use(cors())
  .use(bodyParser())
  .use(handleError)
  .use(r.routes())
  .listen({ port: 8080 }, () => console.log('🚀 API Launched'))
