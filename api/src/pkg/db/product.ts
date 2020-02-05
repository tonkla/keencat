import admin from '../firebase/index'
import { Product, ProductInput } from '../../typings'

const db = admin.firestore()

async function find(id: string) {}

async function findByCategory(categoryId: string): Promise<Product[]> {
  try {
    const products: Product[] = []
    const docs = await db
      .collection('products')
      .where('categoryId', '==', categoryId)
      .get()
    docs.forEach(d => {
      if (d.exists) products.push(d.data() as Product)
    })
    return products
  } catch (e) {
    return []
  }
}

async function create(input: ProductInput): Promise<boolean> {
  try {
    const { owner, ..._input } = input
    const product: Product = { ..._input, ownerId: input.owner.firebaseId }
    await db
      .collection('products')
      .doc(product.id)
      .set(product)
    return true
  } catch (e) {
    return false
  }
}

async function update(product: Product) {}

async function remove(product: Product) {}

export default {
  find,
  findByCategory,
  create,
  update,
  remove,
}
