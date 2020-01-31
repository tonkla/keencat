import firebase from '../../firebase'
import { Page, User } from '../../../typings'

const firestore = firebase.firestore()

async function find(id: string) {}

async function findByOwner(owner: User) {}

async function create(page: Page) {
  try {
    firestore
      .collection('pages')
      .doc(page.owner.firebaseId)
      .collection('pages')
      .doc(page.id)
      .set({ ...page, owner: page.owner.email })
  } catch (e) {
    console.log('create page=', e)
  }
}

async function update(page: Page) {}

async function remove(page: Page) {}

export default {
  find,
  findByOwner,
  create,
  update,
  remove,
}
