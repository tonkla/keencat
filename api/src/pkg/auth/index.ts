import admin from '../firebase'

interface LoginParams {
  uid: string
  providerToken: string
}

async function logIn({ uid, providerToken }: LoginParams): Promise<string> {
  // TODO: verify the token
  return await admin.auth().createCustomToken(uid)
}

export default {
  logIn,
}
