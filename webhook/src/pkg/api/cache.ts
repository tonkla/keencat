import { ConversationStep, Customer, Page, Shop } from '../../typings'

interface CachedPage {
  page: Page
  expiredAt: Date
}

interface CachedShop {
  shop: Shop
  expiredAt: Date
}

interface CachedCustomer {
  customer: Customer
  expiredAt: Date
}

const cachedPage = new Map<string, CachedPage>()
const cachedShop = new Map<string, CachedShop>()
const cachedCustomer = new Map<string, CachedCustomer>()
const conversation = new Map<string, ConversationStep>()

const EXPMIN = 10

function getPage(pageId: string): Page | null {
  const data = cachedPage.get(pageId)
  return data && data.expiredAt > new Date() ? data.page : null
}

function setPage(pageId: string, page: Page) {
  const expiredAt = new Date(new Date().setMinutes(new Date().getMinutes() + EXPMIN))
  return cachedPage.set(pageId, { page, expiredAt })
}

function getShop(pageId: string): Shop | null {
  const data = cachedShop.get(pageId)
  return data && data.expiredAt > new Date() ? data.shop : null
}

function setShop(pageId: string, shop: Shop) {
  const expiredAt = new Date(new Date().setMinutes(new Date().getMinutes() + EXPMIN))
  return cachedShop.set(pageId, { shop, expiredAt })
}

function getCustomer(customerId: string): Customer | null {
  const data = cachedCustomer.get(customerId)
  return data && data.expiredAt > new Date() ? data.customer : null
}

function setCustomer(customerId: string, customer: Customer) {
  const expiredAt = new Date(new Date().setMinutes(new Date().getMinutes() + EXPMIN))
  return cachedCustomer.set(customerId, { customer, expiredAt })
}

function getConversationStep(pageId: string, customerId: string): ConversationStep {
  const step = conversation.get(`${pageId}:${customerId}`)
  return step ? step : ''
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
