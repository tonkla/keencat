import admin from '../firebase/index'
import { Category, CategoryInput } from '../../typings'

const db = admin.firestore()

async function find(id: string) {}

async function findByPage(pageId: string): Promise<Category[]> {
  try {
    const categories: Category[] = []
    const docs = await db
      .collection('categories')
      .where('pageId', '==', pageId)
      .get()
    docs.forEach(d => {
      if (d.exists) categories.push(d.data() as Category)
    })
    return categories
  } catch (e) {
    return []
  }
}

async function findByShop(shopId: string): Promise<Category[]> {
  try {
    const categories: Category[] = []
    const docs = await db
      .collection('categories')
      .where('shopId', '==', shopId)
      .get()
    docs.forEach(d => {
      if (d.exists) categories.push(d.data() as Category)
    })
    return categories
  } catch (e) {
    return []
  }
}

async function create(input: CategoryInput): Promise<boolean> {
  try {
    const { owner, ..._input } = input
    const category: Category = { ..._input, ownerId: input.owner.firebaseId }
    await db
      .collection('categories')
      .doc(category.id)
      .set(category)
    return true
  } catch (e) {
    return false
  }
}

async function update(category: Category) {}

async function remove(category: Category) {}

export default {
  find,
  findByPage,
  findByShop,
  create,
  update,
  remove,
}
