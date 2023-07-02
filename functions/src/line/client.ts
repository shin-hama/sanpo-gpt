import { Client, middleware } from '@line/bot-sdk'
import { defineSecret, defineString } from 'firebase-functions/params'

const channelAccessToken = defineSecret('LINE_CHANNEL_ACCESS_TOKEN')
const channelSecret = defineString('LINE_CHANNEL_SECRET')

export const getClient = () =>
  new Client({
    channelAccessToken: channelAccessToken.value(),
  })

export const lineMiddleware = middleware({ channelSecret: channelSecret as unknown as string })
