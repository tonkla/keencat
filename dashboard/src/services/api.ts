import auth from './firebase/auth'
import firestore from './firebase/firestore'
import { User } from '../typings'

async function createUser(user: User) {
  return await firestore.createUser(user)
}

async function getUser(): Promise<User | null> {
  const u1 = await auth.getUser()
  if (!u1) return null
  const u2 = await getUserByFirebaseId(u1.uid)
  return u2 ? u2 : null
}

async function getUserByFirebaseId(fid: string): Promise<User | null> {
  return await firestore.getUserByFirebaseId(fid)
}

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
  createUser,
  getUser,
  getUserByFirebaseId,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
}
