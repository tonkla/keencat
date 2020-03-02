import admin from '../firebase/index'
import { Shop } from '../../typings'

const db = admin.firestore()

async function find(id: string): Promise<Shop | null> {
  try {
    const doc = await db
      .collection('shops')
      .doc(id)
      .get()
    return doc.exists ? (doc.data() as Shop) : null
  } catch (e) {
    return null
  }
}

async function findByOwner(ownerId: string): Promise<Shop[]> {
  try {
    const shops: Shop[] = []
    const docs = await db
      .collection('shops')
      .where('ownerId', '==', ownerId)
      .get()
    docs.forEach(d => {
      shops.push(d.data() as Shop)
    })
    return shops
  } catch (e) {
    return []
  }
}

async function findByPage(pageId: string): Promise<Shop | null> {
  try {
    const shops: Shop[] = []
    const docs = await db
      .collection('shops')
      .where('pageId', '==', pageId)
      .get()
    docs.forEach(d => {
      shops.push(d.data() as Shop)
    })
    return shops.length > 0 ? shops[0] : null
  } catch (e) {
    return null
  }
}

async function create(shop: Shop): Promise<boolean> {
  try {
    await db
      .collection('shops')
      .doc(shop.id)
      .set(shop)
    return true
  } catch (e) {
    return false
  }
}

async function update(shop: Shop): Promise<boolean> {
  try {
    await db
      .collection('shops')
      .doc(shop.id)
      .set(shop)
    return true
  } catch (e) {
    return false
  }
}

async function remove(shop: Shop): Promise<boolean> {
  try {
    await db
      .collection('shops')
      .doc(shop.id)
      .delete()
    return true
  } catch (e) {
    return false
  }
}

export default {
  find,
  findByOwner,
  findByPage,
  create,
  update,
  remove,
}
