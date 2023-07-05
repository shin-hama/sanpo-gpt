import { onRequest } from 'firebase-functions/v2/https'
import { lineRouter } from './line'
import { channelAccessToken, channelSecret, googleMapApiKey, openAIApiKey } from './core/secrets'
import { nearbySearch } from './places'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const line = onRequest(
  {
    secrets: [channelAccessToken, channelSecret, googleMapApiKey, openAIApiKey],
  },
  lineRouter
)

export const nearby = onRequest(
  {
    secrets: [googleMapApiKey],
  },
  async (req, res) => {
    const result = await nearbySearch(35.658034, 139.701636, 'cafe,relax')
    res.status(200).json(result)
  }
)
