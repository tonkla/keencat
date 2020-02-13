import api from '../api'
import dialogflow from '../dialogflow'
import th from '../../lang/th'
import { Category, Product } from '../../typings'
import { GenericTemplateElement, MessageParams, ResponseMessage } from './typings/response'

const lang = th

function buildCategoryElements(categories: Category[]): GenericTemplateElement[] {
  return categories.map(c => ({
    title: c.name,
    subtitle: '',
    buttons: [
      {
        type: 'postback',
        title: lang.showProducts,
        payload: `categoryId=${c.id}`,
      },
    ],
  }))
}

function buildProductElements(products: Product[]): GenericTemplateElement[] {
  return products.map(p => ({
    title: p.name,
    image_url: p.images && p.images.length > 0 ? p.images[0] : '',
    subtitle: p.description,
    buttons: [
      {
        type: 'web_url',
        url: 'https://keencat.co/',
        title: lang.viewDetails,
      },
      {
        type: 'postback',
        title: lang.buy,
        payload: `productId=${p.id}`,
      },
    ],
  }))
}

function buildConfirmation(product: Product): GenericTemplateElement[] {
  return [
    {
      title: product.name,
      image_url: product.images && product.images.length > 0 ? product.images[0] : '',
      subtitle: product.description,
      buttons: [
        {
          type: 'postback',
          title: lang.buyConfirm,
          payload: `confirmProductId=${product.id}`,
        },
        {
          type: 'postback',
          title: lang.cancel,
          payload: `cancelProductId=${product.id}`,
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

function handleUnknownMessage(): ResponseMessage {
  return { text: 'TODO: Show Help' }
}

async function handleMessage(input: MessageParams): Promise<ResponseMessage> {
  const intent = await dialogflow.detectIntent(input.text)
  if (!intent) return handleUnknownMessage()
  switch (intent.type) {
    case 'greeting': {
      const shop = await api.findShop(input.pageId)
      const text = shop ? `${shop.name} ${intent.text} 😀` : intent.text
      return { text }
    }
    case 'category': {
      const categories = await api.findCategories(input.pageId)
      const elements = buildCategoryElements(categories)
      return buildAttachmentTemplate(elements)
    }
    case 'product': {
      const products = await api.findProducts(input.pageId, input.categoryId)
      const elements = buildProductElements(products)
      return buildAttachmentTemplate(elements)
    }
    case 'address': {
      return { text: lang.endSale }
    }
    default:
      return handleUnknownMessage()
  }
}

async function handlePostback(p: MessageParams): Promise<ResponseMessage> {
  switch (p.text) {
    case 'listProducts': {
      const products = await api.findProducts(p.pageId, p.categoryId)
      const elements = buildProductElements(products)
      return buildAttachmentTemplate(elements)
    }
    case 'buy': {
      if (p.productId) {
        const product = await api.findProduct(p.pageId, p.productId)
        if (product) {
          const elements = buildConfirmation(product)
          return buildAttachmentTemplate(elements)
        }
      }
      return { text: 'Not Found' }
    }
    case 'confirm': {
      if (p.productId) {
        const product = await api.findProduct(p.pageId, p.productId)
        if (product) {
          return { text: `${lang.buyConfirm} ${product.name}` }
        }
      }
      return { text: 'Not Found' }
    }
    case 'cancel': {
      if (p.productId) {
        return { text: lang.buyCancel }
      }
      return { text: 'Not Found' }
    }
    default:
      return handleUnknownMessage()
  }
}

function requestCustomerAddress() {
  return { text: lang.requestCustomerAddress }
}

function requestPayment() {
  return { text: lang.requestPayment }
}

function requestPaymentSlip() {
  return { text: lang.requestPaymentSlip }
}

export default {
  handleMessage,
  handlePostback,
  requestCustomerAddress,
  requestPayment,
  requestPaymentSlip,
}
