import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert('./key.json'),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
})

export default admin
