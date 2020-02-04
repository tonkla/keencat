import admin from '../firebase'

interface LoginParams {
  uid: string
  providerToken: string
}

async function authorize(idToken: string): Promise<string | null> {
  try {
    const { uid } = await admin.auth().verifyIdToken(idToken, false)
    return uid
  } catch (e) {
    return null
  }
}

async function logIn({ uid, providerToken }: LoginParams): Promise<string | null> {
  try {
    // TODO: verify the token
    return await admin.auth().createCustomToken(uid)
  } catch (e) {
    return null
  }
}

export default {
  authorize,
  logIn,
}
