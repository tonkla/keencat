import firebase from '../../firebase'
import { Shop, User } from '../../../typings'

const firestore = firebase.firestore()

async function find(id: string) {}

async function findByOwner(owner: User): Promise<Shop[]> {
  try {
    const docs: firebase.firestore.DocumentData[] = []
    const snapshot = await firestore
      .collection('shops')
      .doc(owner.firebaseId)
      .collection('shops')
      .get()
    snapshot.docs.forEach(d => {
      if (d.exists) docs.push(d.data())
    })
    return docs.map(d => ({ id: d.id, name: d.name, pageId: d.pageId, owner }))
  } catch (e) {
    console.log(e)
    return []
  }
}

async function create(shop: Shop): Promise<boolean> {
  try {
    await firestore
      .collection('shops')
      .doc(shop.owner.firebaseId)
      .collection('shops')
      .doc(shop.id)
      .set({ ...shop, owner: shop.owner.email })
    return true
  } catch (e) {
    console.log(e)
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
