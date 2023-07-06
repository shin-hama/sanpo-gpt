import { AppOptions, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseConfig: AppOptions = {}

if (!getApps().length) {
  initializeApp(firebaseConfig)
  getFirestore().settings({ ignoreUndefinedProperties: true })
}

export const db = getFirestore()
