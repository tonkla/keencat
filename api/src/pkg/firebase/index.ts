import admin from 'firebase-admin'

admin.initializeApp({ credential: admin.credential.cert('./key.json') })

export default admin
