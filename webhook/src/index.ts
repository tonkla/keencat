import axios from 'axios'
import dotenv from 'dotenv'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import qs from 'qs'

// import api from './services/api'
import chatbot from './chatbot'
import { WebhookEntry, MessageEvent } from './typings/request'
import { Message, ResponseMessage } from './typings/response'

dotenv.config()

async function send(senderId: string, message: Message): Promise<void> {
  // try {
  //   const pageAccessToken = await api.getPageAccessToken(senderId)
  //   if (pageAccessToken) {
  //     await axios.post(
  //       'https://graph.facebook.com/v5.0/me/messages',
  //       qs.stringify({ access_token: pageAccessToken, ...message })
  //     )
  //   } else {
  //     // TODO: log('No pageAccessToken')
  //   }
  // } catch (e) {
  //   // TODO: log
  //   if (e.response && e.response.status === 400) {
  //     await api.resetPageAccessToken(senderId)
  //   }
  // }
  const accessToken = process.env.ACCESS_TOKEN || ''
  await axios.post(
    'https://graph.facebook.com/v5.0/me/messages',
    qs.stringify({ access_token: accessToken, ...message })
  )
}

async function handleMessage(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'RESPONSE',
    message: {},
  }

  if (event.message.text) {
    const message = await chatbot.response({
      kind: 'message',
      msg: event.message.text,
      pageId: event.recipient.id,
    })
    await send(event.recipient.id, { ...response, message })
  } else if (event.message.attachments) {
    const attachment = event.message.attachments[0]
    if (attachment && attachment.type === 'image') {
      const message: ResponseMessage = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Is this the right picture?',
                subtitle: 'Tap a button to answer.',
                image_url: attachment.payload.url,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Yes!',
                    payload: 'yes',
                  },
                  {
                    type: 'postback',
                    title: 'No!',
                    payload: 'no',
                  },
                ],
              },
            ],
          },
        },
      }
      await send(event.recipient.id, { ...response, message })
    }
  }
}

async function handlePostback(event: MessageEvent): Promise<void> {
  const senderId = event.recipient.id
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'RESPONSE',
    message: {},
  }

  if (event.postback.payload === 'menu') {
    const message = { text: 'TODO: Show Menu' }
    return await send(senderId, { ...response, message })
  }

  const [kind, id] = event.postback.payload.split('=')
  if (kind === 'categoryId') {
    const message = await chatbot.response({
      kind: 'postback',
      msg: 'list_products',
      pageId: event.recipient.id,
      categoryId: id,
    })
    return await send(senderId, { ...response, message })
  }

  if (kind === 'productId') {
    const message = await chatbot.response({
      kind: 'postback',
      msg: 'buy_product',
      pageId: event.recipient.id,
      productId: id,
    })
    return await send(senderId, { ...response, message })
  }
}

async function handleError(ctx: Context, next: Function) {
  try {
    await next()
  } catch (e) {
    // TODO: log
    ctx.body = ''
  }
}

async function webhookPost(ctx: Context, next: Function) {
  if (ctx.path === '/msg' && ctx.method === 'POST') {
    const { body } = ctx.request
    if (body.object === 'page') {
      const responses: [Promise<void>?] = []
      body.entry.forEach((entry: WebhookEntry) => {
        const event = entry.messaging[0]
        if (event.message) responses.push(handleMessage(event))
        else if (event.postback) responses.push(handlePostback(event))
      })
      await Promise.all(responses)
      ctx.body = 'EVENT_RECEIVED'
    }
  } else await next()
}

async function webhookGet(ctx: Context, next: Function) {
  if (ctx.path === '/msg' && ctx.method === 'GET') {
    if (
      ctx.query['hub.mode'] === 'subscribe' &&
      ctx.query['hub.verify_token'] === process.env.MSG_VERIFY_TOKEN
    ) {
      ctx.body = ctx.query['hub.challenge']
    }
  } else await next()
}

async function getWebview(ctx: Context, next: Function) {
  if (ctx.path === '/get' && ctx.method === 'GET') {
    const referer = ctx.get('Referer')
    if (referer) {
      if (referer.indexOf('www.messenger.com') >= 0) {
        ctx.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/')
      } else if (referer.indexOf('www.facebook.com') >= 0) {
        ctx.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/')
      }
      ctx.sendFile('public/options.html', { root: __dirname })
    }
  } else await next()
}

async function ping(ctx: Context, next: Function) {
  if (ctx.path === '/ping' && (ctx.method === 'GET' || ctx.method === 'HEAD')) ctx.body = 'pong'
  else await next()
}

const app = new Koa()
const port = process.env.APP_PORT || 8080

app
  .use(bodyParser())
  .use(handleError)
  .use(webhookPost)
  .use(webhookGet)
  .use(getWebview)
  .use(ping)

app.listen({ port }, () => console.log(`🚀 Messenger started on port ${port}`))
