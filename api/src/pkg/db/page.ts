import admin from '../firebase/index'
import { Page, User } from '../../typings'

async function find(pageId: string): Promise<Page | null> {
  try {
    const doc = await admin
      .firestore()
      .collection('fbpages')
      .doc(pageId)
      .get()
    if (doc.exists) return doc.data() as Page
    return null
  } catch (e) {
    return null
  }
}

async function findByOwner(owner: User) {}

async function create(page: Page) {}

async function update(page: Page) {}

async function remove(page: Page) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
