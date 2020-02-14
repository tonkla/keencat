import admin from '../firebase/index'
import utils from '../utils'
import shopRepository from './shop'
import { Order, OrderInput } from '../../typings'

const db = admin.firestore()

async function findByShop(shopId: string): Promise<Order[]> {
  try {
    const orders: Order[] = []
    const docs = await db
      .collection('orders')
      .where('shopId', '==', shopId)
      .get()
    docs.forEach(d => {
      orders.push(d.data() as Order)
    })
    return orders
  } catch (e) {
    return []
  }
}

async function create(input: OrderInput) {
  try {
    // TODO: add support to more providers, e.g. LINE
    if (!input.pageId) return

    const shop = await shopRepository.findByPage(input.pageId)
    if (!shop) return false

    const order: Order = {
      id: utils.genId(),
      shopId: shop.id,
      ownerId: shop.ownerId,
      customerId: input.customerId,
      pageId: input.pageId,
      productId: input.productId,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    }
    await db
      .collection('orders')
      .doc(order.id)
      .set(order)
    return true
  } catch (e) {
    return false
  }
}

async function update(input: OrderInput) {
  try {
    // TODO: add support to more providers, e.g. LINE
    if (!input.pageId) return

    let orders: Order[] = []
    const docs = await db
      .collection('orders')
      .where('pageId', '==', input.pageId)
      .where('customerId', '==', input.customerId)
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
  findByShop,
  create,
  update,
}
