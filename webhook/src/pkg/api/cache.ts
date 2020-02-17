import { ConversationStep, Customer, Page, Shop } from '../../typings'

const cachedPage = new Map<string, Page>()
const cachedShop = new Map<string, Shop>()
const cachedCustomer = new Map<string, Customer>()
const conversation = new Map<string, ConversationStep>()

function getPage(pageId: string) {
  return cachedPage.get(pageId)
}

function setPage(pageId: string, page: Page) {
  return cachedPage.set(pageId, page)
}

function getShop(pageId: string) {
  return cachedShop.get(pageId)
}

function setShop(pageId: string, shop: Shop) {
  return cachedShop.set(pageId, shop)
}

function getCustomer(customerId: string) {
  return cachedCustomer.get(customerId)
}

function setCustomer(customerId: string, customer: Customer) {
  return cachedCustomer.set(customerId, customer)
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
