import axios from 'axios'
import qs from 'qs'

import api from '../api'
import cache from '../api/cache'
import dialogflow from '../dialogflow'
import builder from './builder'
import { MessageEvent, WebhookEvent, WebhookParams, PostbackPayload } from './typings/request'
import { Message } from './typings/response'
import { Order } from '../../typings'

function verify({ mode, verifyToken, challenge }: WebhookParams): string {
  const token = process.env.MSG_VERIFY_TOKEN || ''
  return mode === 'subscribe' && verifyToken === token ? challenge : ''
}

async function reply(body: WebhookEvent): Promise<void> {
  if (body.object !== 'page') return
  const responses: Promise<void>[] = []
  body.entry.forEach(entry => {
    entry.messaging.forEach(event => {
      if (event.message) responses.push(handleMessage(event))
      else if (event.postback) responses.push(handlePostback(event))
    })
  })
  await Promise.all(responses)
}

async function handleMessage(event: MessageEvent): Promise<void> {
  await markSeen(event)
  await typingOn(event)

  const pageId = event.recipient.id
  const customerId = event.sender.id
  const { text, attachments } = event.message

  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'RESPONSE',
    message: {},
  }

  // const step = cache.getConversationStep(pageId, customerId)

  if (text) {
    const intent = await dialogflow.detectIntent(text)
    if (!intent) {
      const message = builder.respondFallbackMessage()
      await send(pageId, { ...response, message })
      return
    }

    if (intent.type === 'greeting') {
      const message = await builder.respondGreeting(pageId, customerId, intent.text)
      await send(pageId, { ...response, message })
      cache.setConversationStep(pageId, customerId, 'greeting')
    } else if (intent.type === 'address') {
      const shop = await api.findShop(pageId)
      if (shop) {
        const order: Order = {
          pageId,
          customerId,
          shopId: shop.id,
          customerAddress: event.message.text,
        }
        await api.updateOrder(order)
      }

      const message = builder.requestPayment()
      await send(pageId, { ...response, message })

      await typingOn(event)
      setTimeout(async () => {
        const message = builder.requestTransferSlip()
        await send(pageId, { ...response, message })
      }, 1000)

      cache.setConversationStep(pageId, customerId, 'transferSlip')
    }
  } else if (attachments) {
    const attachment = attachments[0]
    if (attachment && attachment.type === 'image') {
      const shop = await api.findShop(pageId)
      if (shop) {
        const order: Order = {
          pageId,
          customerId,
          shopId: shop.id,
          attachments: [attachment.payload.url],
        }
        await api.updateOrder(order)

        const message = builder.respondApproving()
        await send(pageId, { ...response, message })
      } else {
        await typingOff(event)
      }
    } else {
      await typingOff(event)
    }
  } else {
    const message = builder.respondFallbackMessage()
    await send(pageId, { ...response, message })
  }
}

async function handlePostback(event: MessageEvent): Promise<void> {
  await markSeen(event)
  await typingOn(event)

  const pageId = event.recipient.id
  const customerId = event.sender.id

  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'RESPONSE',
    message: {},
  }

  if (event.postback.payload === 'menu') {
    const message = { text: 'TODO: Show Menu' }
    await send(pageId, { ...response, message })
    return
  }

  const payload: PostbackPayload = JSON.parse(event.postback.payload)

  if (payload.action === 'listProducts') {
    const message = await builder.respondProducts(pageId, payload.categoryId)
    await send(pageId, { ...response, message })
  } else if (payload.action === 'buy') {
    if (payload.productId) {
      const message = await builder.requestConfirm(pageId, payload.productId)
      if (message) {
        await send(pageId, { ...response, message })
      } else {
        await typingOff(event)
      }
    } else {
      await typingOff(event)
    }
  } else if (payload.action === 'confirm') {
    const orderId = await api.createOrder(payload)
    if (orderId) {
      const message = builder.respondCreateOrderSucceeded(orderId)
      await send(pageId, { ...response, message })

      await typingOn(event)
      setTimeout(async () => {
        const message = builder.requestAddress()
        await send(pageId, { ...response, message })
      }, 1000)
    } else typingOff(event)
  } else if (payload.action === 'cancel') {
    const message = builder.respondCancel()
    await send(pageId, { ...response, message })
  } else {
    const message = builder.respondFallbackMessage()
    await send(pageId, { ...response, message })
  }
}

async function markSeen(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'RESPONSE',
    message: {},
  }
  await send(event.recipient.id, { ...response, sender_action: 'mark_seen' })
}

async function typingOn(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'RESPONSE',
    message: {},
  }
  await send(event.recipient.id, { ...response, sender_action: 'typing_on' })
}

async function typingOff(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'RESPONSE',
    message: {},
  }
  await send(event.recipient.id, { ...response, sender_action: 'typing_off' })
}

async function send(pageId: string, message: Message): Promise<void> {
  try {
    const page = await api.findPage(pageId)
    if (page && page.accessToken) {
      const resp = await axios.post(
        'https://graph.facebook.com/v6.0/me/messages',
        qs.stringify({ access_token: page.accessToken, ...message })
      )
      if (resp && resp.data) {
        // TODO: log success, resp.data={ recipient_id?: string, message_id: string }
      }
    }
  } catch (e) {
    console.log('Error=', e.response.data.error)
    // TODO: log
    // https://developers.facebook.com/docs/messenger-platform/reference/send-api/error-codes
    // e.response.data = { error:
    // { message: string, type: string, code: number, error_subcode?: number, fbtrace_id: string }}
    //
    // if (e.response && e.response.status === 400) {
    //   await api.resetPageAccessToken(pageId)
    // }
  }
}

export default {
  reply,
  verify,
}
