import api from '../api'
import th from '../../lang/th'
import { Category, Product } from '../../typings'
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
  return products.map(p => ({
    title: p.name,
    image_url: p.images && p.images.length > 0 ? p.images[0] : '',
    subtitle: p.description,
    buttons: [
      {
        type: 'web_url',
        url: `https://public.keencat.co/${p.shopId}/${p.id}/index.html`,
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

function buildConfirmation(pageId: string, product: Product): GenericTemplateElement[] {
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
            productId: product.id,
            productName: product.name,
            shopId: product.shopId,
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

async function requestConfirm(pageId: string, productId: string) {
  const product = await api.findProduct(pageId, productId)
  if (product) {
    const elements = buildConfirmation(pageId, product)
    return buildAttachmentTemplate(elements)
  }
}

function requestAddress() {
  return { text: lang.requestCustomerAddress }
}

function requestPayment() {
  return { text: lang.requestPayment }
}

function requestTransferSlip() {
  return { text: lang.requestTransferSlip }
}

async function respondGreeting(pageId: string, customerId: string, intentText: string) {
  const customer = await api.findCustomer(customerId)
  const shop = await api.findShop(pageId)
  if (shop) {
    const text = customer
      ? `${shop.name} ${intentText} ${lang.namePrefix}${customer.name} 😀`
      : `${shop.name} ${intentText} 😀`
    return { text }
  }
  return respondFallbackMessage()
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

function respondFallbackMessage(): ResponseMessage {
  return { text: 'TODO: Show Help' }
}

export default {
  requestConfirm,
  requestAddress,
  requestPayment,
  requestTransferSlip,
  respondGreeting,
  respondCategories,
  respondProducts,
  respondConfirm,
  respondCancel,
  respondCreateOrderSucceeded,
  respondApproving,
  respondFallbackMessage,
}
