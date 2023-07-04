import { AppOptions, getApps, initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseConfig: AppOptions = {
  credential: applicationDefault(),
}

if (!getApps().length) {
  initializeApp(firebaseConfig)
  getFirestore().settings({ ignoreUndefinedProperties: true })
}

export const db = getFirestore()
