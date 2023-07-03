import { Client, middleware } from '@line/bot-sdk'
import { RequestHandler } from 'express'
import { channelAccessToken, channelSecret } from '../core/secrets'

export const getClient = () =>
  new Client({
    channelAccessToken: channelAccessToken.value(),
  })

export const lineMiddleware: RequestHandler = async (req, res, next) => {
  await middleware({ channelSecret: channelSecret.value() })(req, res, next)
}
