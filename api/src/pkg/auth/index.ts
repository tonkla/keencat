import admin from '../firebase'

interface LoginParams {
  uid: string
  providerToken: string
}

async function authorize(idToken: string, userFirebaseId: string): Promise<boolean> {
  const { uid } = await admin.auth().verifyIdToken(idToken, false)
  return uid === userFirebaseId
}

async function logIn({ uid, providerToken }: LoginParams): Promise<string> {
  // TODO: verify the token
  return await admin.auth().createCustomToken(uid)
}

export default {
  authorize,
  logIn,
}
