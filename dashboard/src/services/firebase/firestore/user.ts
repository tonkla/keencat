import firebase from '../../firebase'
import auth from '../../firebase/auth'
import { User } from '../../../typings'

const firestore = firebase.firestore()

async function getUser(): Promise<User | null> {
  const u1 = await auth.getUser()
  if (!u1) return null
  const u2 = await findByFirebaseId(u1.uid)
  return u2 ? u2 : null
}

async function findByFirebaseId(fid: string): Promise<User | null> {
  try {
    const doc = await firestore
      .collection('users')
      .doc(fid)
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

async function sendSignInLinkToEmail(email: string): Promise<boolean> {
  return await auth.sendSignInLinkToEmail(email)
}

async function signInWithEmailLink(email: string, link: string) {
  return await auth.signInWithEmailLink(email, link)
}

async function signOut() {
  await auth.signOut()
}

async function isSignInWithEmailLink(link: string): Promise<boolean> {
  return auth.isSignInWithEmailLink(link)
}

export default {
  getUser,
  findByFirebaseId,
  create,
  update,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
}
