import { onRequest } from 'firebase-functions/v2/https'
import { lineRouter } from './line'
import { channelAccessToken, channelSecret, googleMapApiKey, openAIApiKey } from './core/secrets'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const line = onRequest(
  {
    secrets: [channelAccessToken, channelSecret, googleMapApiKey, openAIApiKey],
    region: 'asia-northeast1',
  },
  lineRouter
)
