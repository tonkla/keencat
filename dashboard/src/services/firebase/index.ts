import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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

export default firebase
