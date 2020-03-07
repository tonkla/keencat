import qs from 'qs'

import api from '../api'
import utils from '../utils'
import th from '../../lang/th'
import { Customer, Shop } from '../../typings'
import { ButtonTemplateButton, GenericTemplateElement, ResponseMessage } from './typings/response'

const lang = th

const webviewDomain =
  (utils.isDev() ? process.env.WEBVIEW_DOMAIN_DEV : process.env.WEBVIEW_DOMAIN) || ''

function buildWebviewButton(pageId: string, customerId: string, shop: Shop): ButtonTemplateButton {
  const hmac = utils.createHmac(pageId, customerId)
  const params = qs.stringify({ hmac, pageId, customerId })
  return {
    type: 'web_url',
    title: lang.viewProductsAndServices,
    url: `${webviewDomain}/s/${shop.id}?${params}`,
    webview_height_ratio: 'full',
    webview_share_button: 'hide',
    messenger_extensions: true,
  }
}

function buildButtonTemplate(text: string, buttons: ButtonTemplateButton[]): ResponseMessage {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons,
      },
    },
  }
}

function buildGenericTemplate(elements: GenericTemplateElement[]): ResponseMessage {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements,
      },
    },
  }
}

function respondOrderSummary(totalAmount: number) {
  return { text: `${lang.orderSummary} ฿${totalAmount.toLocaleString()}` }
}

async function requestPayment(pageId: string) {
  const shop = await api.findShop(pageId)
  if (shop) {
    const text = `${lang.requestPayment}
${lang.promptPayId} ${shop.promptPay}

${lang.or}

${shop.bank}
${lang.bankAccountNumber} ${shop.bankAccountNumber}
${lang.bankAccountName} ${shop.bankAccountName}

${lang.shopPhoneNumber} ${shop.phoneNumber}
`
    return { text }
  }
  return null
}

function requestPaymentSlip() {
  return { text: lang.requestPaymentSlip }
}

async function respondGreeting(customer?: Customer | null) {
  if (customer) {
    const name = customer.nickname || customer.name
    const text = name ? `${lang.hello} ${lang.namePrefix}${name}` : lang.hello
    return { text }
  } else {
    return { text: lang.hello }
  }
}

async function respondWelcome(pageId: string) {
  const shop = await api.findShop(pageId)
  if (shop) {
    const text = `${shop.name} ${lang.welcome}`
    return { text }
  }
  return null
}

async function respondWebview(pageId: string, customerId: string) {
  const shop = await api.findShop(pageId)
  if (shop) {
    const button = buildWebviewButton(pageId, customerId, shop)
    return buildButtonTemplate(shop.name, [button])
  }
  return null
}

function respondApproving() {
  return { text: lang.respondApproving }
}

export default {
  requestPayment,
  requestPaymentSlip,

  respondGreeting,
  respondWelcome,
  respondWebview,
  respondOrderSummary,
  respondApproving,
}
