import axios from 'axios'
import qs from 'qs'

import chatbot from '../chatbot'
import { MessageEvent, WebhookEvent, WebhookParams } from './typings/request'
import { Message, ResponseMessage } from './typings/response'

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
  if (event.message.text) {
    const message = await chatbot.handleMessage({
      text: event.message.text,
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
    await send(senderId, { ...response, message })
  }

  const [kind, id] = event.postback.payload.split('=')
  if (kind === 'categoryId') {
    const message = await chatbot.handlePostback({
      text: 'list_products',
      pageId: event.recipient.id,
      categoryId: id,
    })
    await send(senderId, { ...response, message })
  } else if (kind === 'productId') {
    const message = await chatbot.handlePostback({
      text: 'buy_product',
      pageId: event.recipient.id,
      productId: id,
    })
    await send(senderId, { ...response, message })
  }
}

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
  try {
    const accessToken = process.env.ACCESS_TOKEN || ''
    const resp = await axios.post(
      'https://graph.facebook.com/v5.0/me/messages',
      qs.stringify({ access_token: accessToken, ...message })
    )
    if (resp && resp.data) {
      // resp.data = { recipient_id?: string, message_id: string }
    }
  } catch (e) {
    // TODO: log
    // https://developers.facebook.com/docs/messenger-platform/reference/send-api/error-codes
    // e.response.data = { error:
    // { message: string, type: string, code: number, error_subcode?: number, fbtrace_id: string }}
  }
}

export default {
  reply,
  verify,
}
