import firebase from '../../firebase'
import auth from '../../firebase/auth'
import { User } from '../../../typings'

const firestore = firebase.firestore()

async function getUser(): Promise<User | null> {
  const u1 = await auth.getUser()
  if (!u1) return null

  const u2 = await findByFirebaseId(u1.uid)
  if (!u2 && u1.email) {
    const user: User = {
      email: u1.email,
      firebaseId: u1.uid,
    }
    await create(user)
  }
  return u2
}

async function findByFirebaseId(firebaseId: string): Promise<User | null> {
  try {
    const doc = await firestore
      .collection('users')
      .doc(firebaseId)
      .get()
    const d: any = doc.data()
    return doc.exists ? { id: d.id, ...d } : null
  } catch (e) {
    return null
  }
}

async function create(user: User): Promise<boolean> {
  try {
    await firestore
      .collection('users')
      .doc(user.firebaseId)
      .set(user)
    return true
  } catch (e) {
    return false
  }
}

async function update(user: User) {}

export default {
  getUser,
  findByFirebaseId,
  create,
  update,
}
