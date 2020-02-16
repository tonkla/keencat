import { ConversationStep, Customer, Page, Shop } from '../../typings'

const page = new Map<string, Page>()
const shop = new Map<string, Shop>()
const conversation = new Map<string, ConversationStep>()
const customer = new Map<string, Customer>()

function getPage(pageId: string) {
  return page.get(pageId)
}

function setPage(pageId: string, data: Page) {
  return page.set(pageId, data)
}

function getShop(pageId: string) {
  return shop.get(pageId)
}

function setShop(pageId: string, data: Shop) {
  return shop.set(pageId, data)
}

function getCustomer(customerId: string) {
  return customer.get(customerId)
}

function setCustomer(customerId: string, data: Customer) {
  return customer.set(customerId, data)
}

function getConversationStep(pageId: string, customerId: string) {
  const step = conversation.get(`${pageId}:${customerId}`)
  return step ? step : 'blank'
}

function setConversationStep(pageId: string, customerId: string, step: ConversationStep) {
  conversation.set(`${pageId}:${customerId}`, step)
}

export default {
  getPage,
  setPage,
  getShop,
  setShop,
  getCustomer,
  setCustomer,
  getConversationStep,
  setConversationStep,
}
