import firebase from '../../firebase'
import auth from '../../firebase/auth'
import { User } from '../../../typings'

const firestore = firebase.firestore()

async function getUser(): Promise<User | null> {
  const authUser = await auth.getUser()
  if (!authUser) return null

  const user = await findByFirebaseId(authUser.uid)
  if (user) return user
  else if (authUser.email) {
    const user: User = {
      email: authUser.email,
      firebaseId: authUser.uid,
    }
    if (await create(user)) return user
  }
  return null
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
