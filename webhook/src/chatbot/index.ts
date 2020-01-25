import t from '../lang/th'
import api from '../services/api'
import { Category, Product, ResponseParams } from '../typings/common'
import { GenericTemplateElement, ResponseMessage } from '../typings/response'

async function getIntent(text: string): Promise<string> {
  const msg = text ? text.toLowerCase() : ''
  if (msg === 'h' || msg === 'hi' || msg === 'hello') {
    return 'greeting'
  } else if (msg === 'c' || msg === 'category') {
    return 'list_categories'
  } else if (msg === 'p' || msg === 'product') {
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

async function response(params: ResponseParams): Promise<ResponseMessage> {
  if (params.kind === 'message') {
    switch (await getIntent(params.msg)) {
      case 'greeting': {
        return { text: t.hello }
      }
      case 'list_categories': {
        const categories = await api.getCategories(params.pageId)
        const elements = buildCategoryElements(categories)
        return buildAttachmentTemplate(elements)
      }
      case 'list_products': {
        const categoryId = params.categoryId || ''
        const products = await api.getProducts(params.pageId, categoryId)
        const elements = buildProductElements(products)
        return buildAttachmentTemplate(elements)
      }
    }
  } else if (params.kind === 'postback') {
    switch (params.msg) {
      case 'list_products': {
        const categoryId = params.categoryId || ''
        const products = await api.getProducts(params.pageId, categoryId)
        const elements = buildProductElements(products)
        return buildAttachmentTemplate(elements)
      }
      case 'buy_product': {
        return { text: `You buy product id='${params.productId}'` }
      }
    }
  }
  return handleUnknownMessage()
}

export default {
  response,
}
