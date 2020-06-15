import admin from '../firebase'

interface LoginParams {
  uid: string
  providerToken: string
}

async function authorize(idToken: string): Promise<string | null> {
  try {
    const { aud, exp, uid } = await admin.auth().verifyIdToken(idToken, false)
    if (aud !== process.env.FIREBASE_PROJECT_ID) return null
    if (new Date(exp * 1000) < new Date()) return null
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
