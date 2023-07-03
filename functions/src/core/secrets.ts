import { defineSecret } from 'firebase-functions/params'

export const channelAccessToken = defineSecret('LINE_CHANNEL_ACCESS_TOKEN')
export const channelSecret = defineSecret('LINE_CHANNEL_SECRET')

export const googleMapApiKey = defineSecret('GOOGLE_MAP_API_KEY')

export const openAIApiKey = defineSecret('OPENAI_API_KEY')
