import firebase from 'firebase/app'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: 'AIzaSyCWcELkvXZGgeqDpPq_vWoCNB6ADVfzjaM',
  authDomain: 'keencat-1.firebaseapp.com',
  databaseURL: 'https://keencat-1.firebaseio.com',
  projectId: 'keencat-1',
  storageBucket: 'keencat-1.appspot.com',
  messagingSenderId: '947495268379',
  appId: '1:947495268379:web:cfb5596014ec9e26aec8be',
  measurementId: 'G-V7YTH2S5H0',
})

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
