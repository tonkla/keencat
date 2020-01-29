import axios from 'axios'

import auth from './firebase/auth'
// import firestore from './firebase/firestore'
import utils from './utils'
import { User } from '../typings'

interface LoginParams {
  token: string
  uid: string
}

async function signIn(params: LoginParams): Promise<User | null> {
  const url = process.env.REACT_APP_API_URL
  if (!url) return null
  const { data: token } = await axios.post(`${url}/login`, params)
  if (!token) return null
  await auth.signIn(token)
  const user = await auth.getUser()
  if (!user) return null
  return {
    id: '',
    firebaseId: user.uid,
  }
}

async function signOut() {
  await auth.signOut()
}

async function sendSignInLinkToEmail(email: string) {
  await auth.sendSignInLinkToEmail(email)
}

// async function createShop(shop: Shop) {
//   firestore.createShop(shop)
// }

export default {
  signIn,
  signOut,
  sendSignInLinkToEmail,
}
