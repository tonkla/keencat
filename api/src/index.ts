import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-tree-router'

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    // TODO: log
    ctx.status = 500
  }
}

const r = new Router()
r.get('/ping', (ctx: Context) => (ctx.body = 'pong'))

new Koa()
  .use(bodyParser())
  .use(handleError)
  .use(r.routes())
  .listen({ port: 8080 }, () => console.log('🚀 API Launched'))
