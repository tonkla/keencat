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

async function getUser(): Promise<firebase.User | null> {
  try {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
  } catch (e) {
    return null
  }
}

async function signIn(token: string) {
  try {
    await firebase.auth().signInWithCustomToken(token)
  } catch (e) {}
}

async function signOut() {
  try {
    await firebase.auth().signOut()
  } catch (e) {}
}

async function sendSignInLinkToEmail(email: string) {
  const settings = {
    url: '',
  }
  await firebase.auth().sendSignInLinkToEmail(email, settings)
}

export default {
  getUser,
  signIn,
  signOut,
  sendSignInLinkToEmail,
}
