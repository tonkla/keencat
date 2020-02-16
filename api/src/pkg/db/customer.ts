import admin from '../firebase/index'
import { Customer } from '../../typings'

const db = admin.firestore()

async function find(id: string): Promise<Customer | null> {
  try {
    const doc = await db
      .collection('customers')
      .doc(id)
      .get()
    return doc.exists ? (doc.data() as Customer) : null
  } catch (e) {
    return null
  }
}

async function create(customer: Customer): Promise<boolean> {
  try {
    await db
      .collection('customers')
      .doc(customer.id)
      .set(customer)
    return true
  } catch (e) {
    return false
  }
}

export default {
  find,
  create,
}
