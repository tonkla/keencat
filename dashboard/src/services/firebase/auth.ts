import firebase from './index'

const auth = firebase.auth()

async function getUser(): Promise<firebase.User | null> {
  try {
    return new Promise(resolve => {
      auth.onAuthStateChanged(user => resolve(user))
    })
  } catch (e) {
    return null
  }
}

async function isSignInWithEmailLink(link: string): Promise<boolean> {
  try {
    return auth.isSignInWithEmailLink(link)
  } catch (e) {
    return false
  }
}

async function sendSignInLinkToEmail(email: string): Promise<boolean> {
  try {
    const url = process.env.REACT_APP_EMAIL_SIGN_IN_CALLBACK_URL
    if (!url) return false
    const settings = {
      url,
      handleCodeInApp: true,
    }
    await auth.sendSignInLinkToEmail(email, settings)
    return true
  } catch (e) {
    return false
  }
}

async function signInWithEmailLink(email: string, link: string) {
  try {
    return await auth.signInWithEmailLink(email, link)
  } catch (e) {
    return null
  }
}

async function signInWithCustomToken(token: string) {
  try {
    await auth.signInWithCustomToken(token)
  } catch (e) {}
}

async function signOut() {
  try {
    await auth.signOut()
  } catch (e) {}
}

export default {
  getUser,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithCustomToken,
  signOut,
}
