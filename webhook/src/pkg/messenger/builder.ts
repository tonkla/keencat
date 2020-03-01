import api from '../api'
import th from '../../lang/th'
import { Category, Customer, Product } from '../../typings'
import { GenericTemplateElement, ResponseMessage } from './typings/response'

const lang = th

function buildCategoryElements(pageId: string, categories: Category[]): GenericTemplateElement[] {
  return categories.map(c => ({
    title: c.name,
    subtitle: '',
    buttons: [
      {
        type: 'postback',
        title: lang.showProducts,
        payload: JSON.stringify({
          action: 'listProducts',
          pageId,
          categoryId: c.id,
        }),
      },
    ],
  }))
}

function buildProductElements(pageId: string, products: Product[]): GenericTemplateElement[] {
  const domain =
    (process.env.NODE_ENV === 'development'
      ? process.env.WEBVIEW_DOMAIN_DEV
      : process.env.WEBVIEW_DOMAIN) || ''
  return products.map(p => ({
    title: p.name,
    image_url: p.images && p.images.length > 0 ? p.images[0] : '',
    subtitle: p.description,
    buttons: [
      {
        type: 'web_url',
        url: `${domain}/${p.shopId}/${p.id}`,
        title: lang.viewDetails,
        webview_height_ratio: 'TALL',
      },
      {
        type: 'postback',
        title: lang.buy,
        payload: JSON.stringify({
          action: 'buy',
          pageId,
          productId: p.id,
          productName: p.name,
          shopId: p.shopId,
          ownerId: p.ownerId,
        }),
      },
    ],
  }))
}

function buildConfirmation(
  pageId: string,
  customerId: string,
  product: Product
): GenericTemplateElement[] {
  return [
    {
      title: product.name,
      image_url: product.images && product.images.length > 0 ? product.images[0] : '',
      subtitle: product.description,
      buttons: [
        {
          type: 'postback',
          title: lang.buyConfirm,
          payload: JSON.stringify({
            action: 'confirm',
            pageId,
            customerId,
            shopId: product.shopId,
            productId: product.id,
            productName: product.name,
            ownerId: product.ownerId,
          }),
        },
        {
          type: 'postback',
          title: lang.cancel,
          payload: JSON.stringify({
            action: 'cancel',
            pageId,
            productId: product.id,
            productName: product.name,
          }),
        },
      ],
    },
  ]
}

function buildAttachmentTemplate(elements: GenericTemplateElement[]): ResponseMessage {
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

function requestDesire() {
  return { text: lang.requestDesire }
}

async function requestConfirm(pageId: string, customerId: string, productId: string) {
  const product = await api.findProduct(pageId, productId)
  if (product) {
    const elements = buildConfirmation(pageId, customerId, product)
    return buildAttachmentTemplate(elements)
  }
}

function requestName() {
  return { text: lang.requestCustomerName }
}

function requestPhone() {
  return { text: lang.requestCustomerPhone }
}

function requestAddress() {
  return { text: lang.requestCustomerAddress }
}

function requestPayment() {
  return { text: lang.requestPayment }
}

function requestPaymentSlip() {
  return { text: lang.requestPayment }
}

async function respondGreeting(intentText: string, customer?: Customer | null) {
  if (customer) {
    const name = customer.nickname || customer.name
    const text = name
      ? `${intentText} ${lang.namePrefix}${name}`
      : `${intentText} ${lang.existingCustomer}`
    return { text }
  } else {
    const text = `${intentText} ${lang.newCustomer}`
    return { text }
  }
}

async function respondWelcome(pageId: string) {
  const shop = await api.findShop(pageId)
  if (shop) {
    const text = `${shop.name} ${lang.welcome}`
    return { text }
  }
}

async function respondCategories(pageId: string) {
  const categories = await api.findCategories(pageId)
  const elements = buildCategoryElements(pageId, categories)
  return buildAttachmentTemplate(elements)
}

async function respondProducts(pageId: string, categoryId?: string) {
  const products = await api.findProducts(pageId, categoryId)
  const elements = buildProductElements(pageId, products)
  return buildAttachmentTemplate(elements)
}

async function respondConfirm(pageId: string, productId: string) {
  const product = await api.findProduct(pageId, productId)
  if (product) return { text: `${lang.buyConfirm} ${product.name}` }
}

function respondCancel() {
  return { text: lang.buyCancel }
}

function respondCreateOrderSucceeded(orderId: string) {
  return { text: `${lang.yourOrderIdIs} ${orderId}` }
}

function respondApproving() {
  return { text: lang.respondApproving }
}

function respondFailure(): ResponseMessage {
  return { text: lang.failure }
}

function respondNotFound(): ResponseMessage {
  return { text: lang.notFound }
}

function respondUnknown(): ResponseMessage {
  return { text: lang.unknown }
}

export default {
  requestDesire,
  requestConfirm,
  requestName,
  requestPhone,
  requestAddress,
  requestPayment,
  requestPaymentSlip,

  respondGreeting,
  respondWelcome,
  respondCategories,
  respondProducts,
  respondConfirm,
  respondCancel,
  respondCreateOrderSucceeded,
  respondApproving,

  respondFailure,
  respondNotFound,
  respondUnknown,
}
