import api from '../api'
import dialogflow from '../dialogflow'
import { Category, Product } from '../../typings'
import { GenericTemplateElement, MessageParams, ResponseMessage } from './typings/response'

function buildCategoryElements(categories: Category[]): GenericTemplateElement[] {
  return categories.map(c => ({
    title: c.name,
    image_url: 'https://picsum.photos/id/1062/300/200',
    subtitle: '',
    default_action: {
      type: 'web_url',
      url: 'https://keencat.co/',
      webview_height_ratio: 'COMPACT',
      messenger_extensions: true,
    },
    buttons: [
      {
        type: 'web_url',
        url: 'https://keencat.co/',
        title: 'View Details',
        webview_height_ratio: 'TALL',
        messenger_extensions: true,
      },
      {
        type: 'postback',
        title: 'Show Products',
        payload: `categoryId=${c.id}`,
      },
    ],
  }))
}

function buildProductElements(products: Product[]): GenericTemplateElement[] {
  return products.map(p => ({
    title: p.name,
    image_url: 'https://picsum.photos/id/1025/300/200',
    subtitle: '',
    default_action: {
      type: 'web_url',
      url: 'https://keencat.co/',
      webview_height_ratio: 'COMPACT',
    },
    buttons: [
      {
        type: 'web_url',
        url: 'https://keencat.co/',
        title: 'View Details',
      },
      {
        type: 'postback',
        title: 'Buy',
        payload: `productId=${p.id}`,
      },
    ],
  }))
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
    case 'greeting':
      return { text: intent.text }
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
    case 'buyProduct': {
      return { text: `You buy product id='${p.productId}'` }
    }
    default:
      return handleUnknownMessage()
  }
}

export default {
  handleMessage,
  handlePostback,
}
