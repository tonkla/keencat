import axios from 'axios'
import qs from 'qs'

import api from '../api'
import handler from './handler'
import { MessageEvent, WebhookEvent, WebhookParams } from './typings/request'
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
  const response: Message = {
    recipient: { id: event.sender.id },
    messaging_type: 'RESPONSE',
    message: {},
  }
  await markSeen(event)
  await typingOn(event)

  if (event.message.text) {
    const { intent, ...message } = await handler.handleMessage({
      text: event.message.text,
      pageId: event.recipient.id,
    })
    await send(event.recipient.id, { ...response, message })

    // Update customer address
    if (intent === 'address') {
      const order: Order = {
        pageId: event.recipient.id,
        customerId: event.sender.id,
        customerAddress: event.message.text,
      }
      await api.updateOrder(order)
    }
  } else if (event.message.attachments) {
    const attachment = event.message.attachments[0]
    if (attachment && attachment.type === 'image') {
      const message = handler.requestCustomerAddress()
      await send(event.recipient.id, { ...response, message })

      // Update transfer slip
      const order: Order = {
        pageId: event.recipient.id,
        customerId: event.sender.id,
        attachments: [attachment.payload.url],
      }
      await api.updateOrder(order)
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
  await markSeen(event)
  await typingOn(event)

  if (event.postback.payload === 'menu') {
    const message = { text: 'TODO: Show Menu' }
    await send(senderId, { ...response, message })
    return
  }

  const [key, id] = event.postback.payload.split('=')
  if (key === 'categoryId') {
    const message = await handler.handlePostback({
      text: 'listProducts',
      pageId: event.recipient.id,
      categoryId: id,
    })
    await send(senderId, { ...response, message })
  } else if (key === 'productId') {
    const message = await handler.handlePostback({
      text: 'buy',
      pageId: event.recipient.id,
      productId: id,
    })
    await send(senderId, { ...response, message })
  } else if (key === 'confirmProductId') {
    const message = await handler.handlePostback({
      text: 'confirm',
      pageId: event.recipient.id,
      productId: id,
    })
    await send(senderId, { ...response, message })

    await typingOn(event)
    setTimeout(async () => {
      const msg2 = handler.requestPayment()
      await send(senderId, { ...response, message: msg2 })

      await typingOn(event)
      setTimeout(async () => {
        const msg3 = handler.requestPaymentSlip()
        await send(senderId, { ...response, message: msg3 })
      }, 1000)
    }, 1000)

    // Create purchasing order
    const order: Order = {
      pageId: event.recipient.id,
      customerId: event.sender.id,
      productId: id,
    }
    await api.createOrder(order)
  } else if (key === 'cancelProductId') {
    const message = await handler.handlePostback({
      text: 'cancel',
      pageId: event.recipient.id,
      productId: id,
    })
    await send(senderId, { ...response, message })
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

async function send(pageId: string, message: Message): Promise<void> {
  try {
    const pageAccessToken = await api.getPageAccessToken(pageId)
    if (pageAccessToken) {
      const resp = await axios.post(
        'https://graph.facebook.com/v6.0/me/messages',
        qs.stringify({ access_token: pageAccessToken, ...message })
      )
      if (resp && resp.data) {
        // TODO: log success, resp.data={ recipient_id?: string, message_id: string }
      }
    }
  } catch (e) {
    // TODO: log
    // https://developers.facebook.com/docs/messenger-platform/reference/send-api/error-codes
    // e.response.data = { error:
    // { message: string, type: string, code: number, error_subcode?: number, fbtrace_id: string }}
    //
    // if (e.response && e.response.status === 400) {
    //   await api.resetPageAccessToken(senderId)
    // }
  }
}

export default {
  reply,
  verify,
}
