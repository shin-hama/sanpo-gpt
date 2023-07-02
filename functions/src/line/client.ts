import { Client, middleware } from '@line/bot-sdk'
import { RequestHandler } from 'express'
import { defineString } from 'firebase-functions/params'

const channelAccessToken = defineString('LINE_CHANNEL_ACCESS_TOKEN')
const channelSecret = defineString('LINE_CHANNEL_SECRET')

export const getClient = () =>
  new Client({
    channelAccessToken: channelAccessToken.value(),
  })

export const lineMiddleware: RequestHandler = async (req, res, next) => {
  await middleware({ channelSecret: channelSecret.value() })(req, res, next)
}
