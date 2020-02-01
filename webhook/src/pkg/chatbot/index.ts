import t from '../../lang/th'
import api from '../api'
import { Category, Product } from '../../typings'
import {
  GenericTemplateElement,
  MessageParams,
  ResponseMessage,
} from '../messenger/typings/response'

async function getIntent(text: string): Promise<string> {
  const txt = text.toLowerCase()
  if (txt === 'h' || txt === 'hi' || txt === 'hello') {
    return 'greeting'
  } else if (txt === 'c' || txt === 'category') {
    return 'list_categories'
  } else if (txt === 'p' || txt === 'product') {
    return 'list_products'
  }
  return ''
}

function buildCategoryElements(categories: Category[]): GenericTemplateElement[] {
  return categories.map(c => ({
    title: c.name,
    image_url: 'https://picsum.photos/id/1062/300/200',
    subtitle: '',
    default_action: {
      type: 'web_url',
      url: 'https://www.sleepycatty.com/',
      webview_height_ratio: 'COMPACT',
      messenger_extensions: true,
    },
    buttons: [
      {
        type: 'web_url',
        url: 'https://www.sleepycatty.com/',
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
      url: 'https://www.sleepycatty.com',
      webview_height_ratio: 'COMPACT',
    },
    buttons: [
      {
        type: 'web_url',
        url: 'https://www.sleepycatty.com',
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
  return { text: 'TODO: show help' }
}

async function handleMessage(p: MessageParams): Promise<ResponseMessage> {
  switch (await getIntent(p.text)) {
    case 'greeting':
      return { text: t.hello }
    case 'list_categories': {
      const categories = await api.getCategories(p.pageId)
      const elements = buildCategoryElements(categories)
      return buildAttachmentTemplate(elements)
    }
    case 'list_products': {
      const categoryId = p.categoryId || ''
      const products = await api.getProducts(p.pageId, categoryId)
      const elements = buildProductElements(products)
      return buildAttachmentTemplate(elements)
    }
    default:
      return handleUnknownMessage()
  }
}

async function handlePostback(p: MessageParams): Promise<ResponseMessage> {
  switch (p.text) {
    case 'list_products': {
      const products = await api.getProducts(p.pageId, p.categoryId)
      const elements = buildProductElements(products)
      return buildAttachmentTemplate(elements)
    }
    case 'buy_product': {
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
