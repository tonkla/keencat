import admin from '../firebase'
import storage from '../storage'
import utils from '../utils'
import { Order, OrderCreate, OrderUpdate } from '../../typings'

const db = admin.firestore()

async function find(id: string): Promise<Order | null> {
  try {
    const doc = await db
      .collection('orders')
      .doc(id)
      .get()
    return doc.exists ? (doc.data() as Order) : null
  } catch (e) {
    return null
  }
}

async function findByShop(shopId: string, createdDate: string): Promise<Order[]> {
  try {
    const orders: Order[] = []
    const docs = await db
      .collection('orders')
      .where('shopId', '==', shopId)
      .where('createdDate', '==', createdDate)
      .orderBy('createdAt', 'desc')
      .get()
    docs.forEach(d => {
      orders.push(d.data() as Order)
    })
    return orders
  } catch (e) {
    return []
  }
}

async function create(input: OrderCreate): Promise<string | null> {
  try {
    if (!input.shopId || !input.ownerId) return null

    const createdAt = new Date().toISOString()
    const order: Order = {
      id: utils.genId(),
      shopId: input.shopId,
      pageId: input.pageId,
      ownerId: input.ownerId,
      customerId: input.customerId,
      items: input.items,
      totalAmount: input.totalAmount,
      status: 'unpaid',
      createdAt,
      createdDate: createdAt.split('T')[0],
    }
    await db
      .collection('orders')
      .doc(order.id)
      .set(order)
    return order.id
  } catch (e) {
    return null
  }
}

async function update(input: OrderUpdate): Promise<boolean> {
  if (!input.id || !input.status) return false
  try {
    const updated = {
      note: input.note,
      status: input.status,
      updatedAt: new Date().toISOString(),
    }
    await db
      .collection('orders')
      .doc(input.id)
      .set(updated, { merge: true })
    return true
  } catch (e) {
    return false
  }
}

async function updateAttachment(input: OrderUpdate): Promise<boolean> {
  if (!input.shopId || !input.attachment) return false
  try {
    let orders: Order[] = []
    const docs = await db
      .collection('orders')
      .where('shopId', '==', input.shopId)
      .where('customerId', '==', input.customerId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()
    docs.forEach(doc => {
      orders.push(doc.data() as Order)
    })
    if (orders.length < 1) return false
    const order = orders[0]
    const mediaLink = await storage.copyImage(order.shopId, order.id, input.attachment)
    if (!mediaLink) return false
    const attachments = order.attachments ? [mediaLink, ...order.attachments] : [mediaLink]
    await db
      .collection('orders')
      .doc(order.id)
      .set(
        {
          attachments,
          status: 'approving',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      )
    return true
  } catch (e) {
    return false
  }
}

export default {
  find,
  findByShop,
  create,
  update,
  updateAttachment,
}
