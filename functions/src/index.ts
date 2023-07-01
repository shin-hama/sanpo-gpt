import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { nearbySearch } from './places'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

export const nearby = onRequest({}, async (request, response) => {
  logger.info('nearby', { structuredData: true })
  await nearbySearch()
  response.status(200).send('')
})
