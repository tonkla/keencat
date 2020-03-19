import axios from 'axios'
import qs from 'qs'

import api from '../api'
import cache from '../api/cache'
import dialogflow from '../dialogflow'
import logging from '../logging'
import builder from './builder'
import { MessageEvent, WebhookEvent, WebhookParams } from './typings/request'
import { Message } from './typings/response'
import { CartItem, Customer, OrderCreate, OrderUpdate } from '../../typings'

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
  const shop = await api.findShop(event.recipient.id)
  if (!shop || !shop.isActive) return

  const pageId = event.recipient.id
  const customerId = event.sender.id
  const { text, attachments } = event.message

  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'response',
    message: {},
  }

  const step = cache.getConversationStep(pageId, customerId)

  if (text) {
    const intent = await dialogflow.detectIntent(text)
    if (!intent) {
      // TODO: handle unknown intent
      cache.setConversationStep(pageId, customerId, '')
      return
    }

    if (intent.type === 'greeting') {
      await markSeen(event)
      await typingOn(event)

      if (step === 'respondGreeting') {
        const message = { text: '😊' }
        await send(pageId, { ...response, message })
        return
      }

      const customer = await api.findCustomer(customerId)
      const message = await builder.respondGreeting(customer)
      await send(pageId, { ...response, message })
      cache.setConversationStep(pageId, customerId, 'respondGreeting')

      await typingOn(event)
      setTimeout(async () => {
        const message = await builder.respondWelcome(pageId)
        if (message) await send(pageId, { ...response, message })
        else {
          await typingOff(event)
          return
        }
      }, 1000)
      return
    }
    // The customer asks for what we have
    else if (intent.type === 'product') {
      await markSeen(event)
      await typingOn(event)
      const message = await builder.respondWebview(pageId, customerId)
      if (message) {
        await send(pageId, { ...response, message })
        cache.setConversationStep(pageId, customerId, '')
        return
      }
    }
  }
  // Attachment: Image
  else if (attachments) {
    const attachment = attachments[0]
    if (attachment && attachment.type === 'image') {
      // Ignore stricker and GIF
      if (attachment.payload.sticker_id || /\.gif/.test(attachment.payload.url)) return

      const shop = await api.findShop(pageId)
      if (shop) {
        await markSeen(event)
        await typingOn(event)

        const order: OrderUpdate = {
          shopId: shop.id,
          pageId,
          customerId,
          attachment: attachment.payload.url,
        }
        await api.updateOrder(order)

        const message = builder.respondApproving()
        await send(pageId, { ...response, message })
        cache.setConversationStep(pageId, customerId, '')
        return
      }
    }
  }
  // Fallback
  await typingOff(event)
  cache.setConversationStep(pageId, customerId, '')
}

async function handlePostback(event: MessageEvent): Promise<void> {
  const shop = await api.findShop(event.recipient.id)
  if (!shop || !shop.isActive) return

  const pageId = event.recipient.id
  const customerId = event.sender.id

  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'response',
    message: {},
  }

  if (event.postback.payload === 'shopNow') {
    await markSeen(event)
    await typingOn(event)
    const message = await builder.respondWebview(pageId, customerId)
    if (message) {
      await send(pageId, { ...response, message })
      cache.setConversationStep(pageId, customerId, '')
      return
    }
  }
}

async function handlePostbackFromWebview(pageId: string, customer: Customer, items: CartItem[]) {
  // Create order
  if (!items || items.length < 1) return
  // Recalculate the amount because I don't trust the data from webview
  const newItems = items.map(item => ({
    productId: item.product.id,
    productName: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    amount: item.product.price * item.quantity,
  }))
  const totalAmount = newItems.reduce((accum, item) => accum + item.amount, 0)
  const order: OrderCreate = {
    pageId,
    shopId: items[0].product.shopId,
    ownerId: items[0].product.ownerId,
    customerId: customer.id,
    items: newItems,
    totalAmount,
  }
  await api.createOrder(order)

  // Respond order summary and request payment
  const response: Message = {
    recipient: { id: customer.id },
    messaging_type: 'response',
    message: {},
  }

  await typingOnManual(pageId, customer.id)
  const message = builder.respondOrderSummary(totalAmount)
  await send(pageId, { ...response, message })

  await typingOnManual(pageId, customer.id)
  setTimeout(async () => {
    const message = await builder.requestPayment(pageId)
    if (message) {
      await send(pageId, { ...response, message })

      await typingOnManual(pageId, customer.id)
      setTimeout(async () => {
        const message = builder.requestPaymentSlip()
        await send(pageId, { ...response, message })
      }, 1000)
    } else {
      await typingOffManual(pageId, customer.id)
    }
  }, 1000)
}

async function markSeen(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'response',
    message: {},
  }
  await send(event.recipient.id, { ...response, sender_action: 'mark_seen' })
}

async function typingOn(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'response',
    message: {},
  }
  await send(event.recipient.id, { ...response, sender_action: 'typing_on' })
}

async function typingOnManual(pageId: string, customerId: string): Promise<void> {
  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'response',
    message: {},
  }
  await send(pageId, { ...response, sender_action: 'typing_on' })
}

async function typingOff(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'response',
    message: {},
  }
  await send(event.recipient.id, { ...response, sender_action: 'typing_off' })
}

async function typingOffManual(pageId: string, customerId: string): Promise<void> {
  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'response',
    message: {},
  }
  await send(pageId, { ...response, sender_action: 'typing_off' })
}

async function send(pageId: string, message: Message): Promise<void> {
  try {
    const page = await api.findPage(pageId)
    if (page && page.accessToken) {
      await axios.post(
        'https://graph.facebook.com/v6.0/me/messages',
        qs.stringify({ access_token: page.accessToken, ...message })
      )
      // resp.data: { recipient_id?: string, message_id: string }
    }
  } catch (e) {
    try {
      const _message: Message = { ...message, message: {}, sender_action: 'typing_off' }
      const page = await api.findPage(pageId)
      if (page && page.accessToken) {
        await axios.post(
          'https://graph.facebook.com/v6.0/me/messages',
          qs.stringify({ access_token: page.accessToken, ..._message })
        )
      }
    } catch (e) {
      await logging.error(e.response.data.error)
      return
    }

    await logging.error(e.response.data.error)
    // error: { message: string, type: string, code: number, error_subcode?: number, fbtrace_id: string }}
    // See more, https://developers.facebook.com/docs/messenger-platform/reference/send-api/error-codes
  }
}

export default {
  reply,
  verify,
  handlePostbackFromWebview,
}
