import admin from '../firebase/index'
import { Shop } from '../../typings'

const db = admin.firestore()

async function find(id: string) {}

async function findByOwner(ownerId: string): Promise<Shop[]> {
  try {
    const shops: Shop[] = []
    const docs = await db
      .collection('shops')
      .where('owner', '==', ownerId)
      .get()
    docs.forEach(d => {
      if (d.exists) shops.push(d.data() as Shop)
    })
    return shops
  } catch (e) {
    return []
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

async function update(shop: Shop) {}

async function remove(shop: Shop) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
