import admin from '../firebase/index'
import { Order, OrderInput } from '../../typings'

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
      .limit(30)
      .get()
    docs.forEach(d => {
      orders.push(d.data() as Order)
    })
    return orders
  } catch (e) {
    return []
  }
}

async function create(input: OrderInput): Promise<string | null> {
  try {
    if (!input.shopId || !input.ownerId) return null

    const createdAt = new Date().toISOString()
    const id = createdAt.replace(/[-T:Z.]/g, '')

    const order: Order = {
      id,
      pageId: input.pageId,
      customerId: input.customerId,
      shopId: input.shopId,
      ownerId: input.ownerId,
      productId: input.productId,
      productName: input.productName,
      status: 'unpaid',
      createdAt,
      createdDate: createdAt.split('T')[0],
    }
    await db
      .collection('orders')
      .doc(order.id)
      .set(order)
    return id
  } catch (e) {
    return null
  }
}

async function update(input: OrderInput) {
  try {
    if (!input.shopId) return

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
    if (orders.length > 0) {
      const order = { ...orders[0], updatedAt: new Date().toISOString() }

      if (input.attachments) {
        order.attachments = order.attachments
          ? [...input.attachments, ...order.attachments]
          : input.attachments
        order.status = 'approving'
      }

      if (input.customerAddress) {
        order.customerAddress = input.customerAddress
      }

      await db
        .collection('orders')
        .doc(order.id)
        .set(order)
    }
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
}
