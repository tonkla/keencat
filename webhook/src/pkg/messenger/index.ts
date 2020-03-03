import axios from 'axios'
import qs from 'qs'

import api from '../api'
import cache from '../api/cache'
import dialogflow from '../dialogflow'
import builder from './builder'
import { MessageEvent, WebhookEvent, WebhookParams, PostbackPayload } from './typings/request'
import { Message } from './typings/response'
import { Customer, Order } from '../../typings'

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

  await markSeen(event)
  await typingOn(event)

  const pageId = event.recipient.id
  const customerId = event.sender.id
  const { text, attachments } = event.message

  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'response',
    message: {},
  }

  const customer = await api.findCustomer(customerId)
  if (!customer) {
    const customer: Customer = {
      id: customerId,
      source: 'messenger',
    }
    if (await api.createCustomer(customer)) {
      cache.setCustomer(customerId, customer)
    }
  }

  const step = cache.getConversationStep(pageId, customerId)

  if (text) {
    const intent = await dialogflow.detectIntent(text)
    if (!intent) {
      const message = builder.respondUnknown()
      await send(pageId, { ...response, message })
      return
    }

    if (intent.type === 'greeting') {
      if (step === 'respondGreeting') {
        const message = { text: '😊' }
        await send(pageId, { ...response, message })
        return
      }

      const message = await builder.respondGreeting(intent.text, customer)
      await send(pageId, { ...response, message })

      await typingOn(event)
      setTimeout(async () => {
        const message = await builder.respondWelcome(pageId)
        if (message) await send(pageId, { ...response, message })
        else {
          const message = builder.respondFailure()
          await send(pageId, { ...response, message })
          return
        }

        await typingOn(event)
        setTimeout(async () => {
          const message = builder.requestDesire()
          await send(pageId, { ...response, message })

          cache.setConversationStep(pageId, customerId, 'respondGreeting')
        }, 1000)
      }, 1000)

      return
    }
    // The customer asks for what categories we have
    else if (intent.type === 'category') {
      const message = await builder.respondCategories(pageId, customerId)
      await send(pageId, { ...response, message })
      return
    }
    // The customer asks for what products we have
    else if (intent.type === 'product') {
      const message = await builder.respondProducts(pageId)
      await send(pageId, { ...response, message })
      return
    }
    // The customer told their name
    else if (step === 'requestName' || intent.type === 'name') {
      if (customer) {
        await api.updateCustomer({ ...customer, name: text })
        if (customer.name) {
          // const message = builder.respondExistingName(customer.name)
          // await send(pageId, { ...response, message })
          // cache.setConversationStep(pageId, customerId, 'requestPhone')
          // return
        }
      }

      const message = builder.requestPhone()
      await send(pageId, { ...response, message })
      cache.setConversationStep(pageId, customerId, 'requestPhone')
      return
    }
    // The customer told their phone number
    else if (step === 'requestPhone' || intent.type === 'phone') {
      if (customer) await api.updateCustomer({ ...customer, phone: text })
    }
    // The customer told their address
    else if (step === 'requestAddress' || intent.type === 'address') {
      if (customer) await api.updateCustomer({ ...customer, address: text })

      const message = builder.requestPayment()
      await send(pageId, { ...response, message })

      await typingOn(event)
      setTimeout(async () => {
        const message = builder.requestPayment()
        await send(pageId, { ...response, message })
        cache.setConversationStep(pageId, customerId, 'requestPayment')
      }, 1000)

      return
    }
  }
  // Attachment: Image
  else if (attachments) {
    const attachment = attachments[0]
    if (attachment && attachment.type === 'image' && step === 'requestPayment') {
      // Reject stricker and GIF
      if (attachment.payload.sticker_id || /\.gif/.test(attachment.payload.url)) return

      const shop = await api.findShop(pageId)
      if (shop) {
        const order: Order = {
          pageId,
          customerId,
          shopId: shop.id,
          attachment: attachment.payload.url,
        }
        await api.updateOrder(order)

        const message = builder.respondApproving()
        await send(pageId, { ...response, message })
        return
      }
    }
  }

  // Fallback
  const message = builder.respondUnknown()
  await send(pageId, { ...response, message })
}

async function handlePostback(event: MessageEvent): Promise<void> {
  const shop = await api.findShop(event.recipient.id)
  if (!shop || !shop.isActive) return

  await markSeen(event)
  await typingOn(event)

  const pageId = event.recipient.id
  const customerId = event.sender.id

  const response: Message = {
    recipient: { id: customerId },
    messaging_type: 'response',
    message: {},
  }

  if (event.postback.payload === 'menu') {
    const message = { text: 'TODO: Show Menu' }
    await send(pageId, { ...response, message })
    return
  }

  const customer = await api.findCustomer(customerId)
  if (!customer) {
    const customer: Customer = {
      id: customerId,
      source: 'messenger',
    }
    if (await api.createCustomer(customer)) {
      cache.setCustomer(customerId, customer)
    }
  }

  const payload: PostbackPayload = JSON.parse(event.postback.payload)

  if (payload.action === 'listProducts') {
    const message = await builder.respondProducts(pageId, payload.categoryId)
    await send(pageId, { ...response, message })
    return
  } else if (payload.action === 'buy') {
    if (payload.productId) {
      const message = await builder.requestConfirm(pageId, customerId, payload.productId)
      if (message) {
        await send(pageId, { ...response, message })
        return
      }
    }
  } else if (payload.action === 'confirm') {
    const orderId = await api.createOrder(payload)
    if (orderId) {
      const message = builder.respondCreateOrderSucceeded(orderId)
      await send(pageId, { ...response, message })

      await typingOn(event)
      setTimeout(async () => {
        const message = builder.requestName()
        await send(pageId, { ...response, message })
        cache.setConversationStep(pageId, customerId, 'requestName')
      }, 1000)
      return
    }
  } else if (payload.action === 'cancel') {
    const message = builder.respondCancel()
    await send(pageId, { ...response, message })
    return
  }

  const message = builder.respondUnknown()
  await send(pageId, { ...response, message })
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

async function typingOff(event: MessageEvent): Promise<void> {
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'response',
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
    try {
      const _message: Message = { ...message, message: {}, sender_action: 'typing_off' }
      const page = await api.findPage(pageId)
      if (page && page.accessToken) {
        await axios.post(
          'https://graph.facebook.com/v6.0/me/messages',
          qs.stringify({ access_token: page.accessToken, ..._message })
        )
      }
    } catch (e) {}

    // TODO: log
    console.log('Error=', e.response.data.error)
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
  send,
}
