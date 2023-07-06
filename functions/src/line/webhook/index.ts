import { WebhookEvent } from '@line/bot-sdk'
import { getClient } from '../client'
import { messageEventHandler } from './message'

export async function webhookHandler(event: WebhookEvent) {
  if (event.type === 'message') {
    const message = await messageEventHandler(event)

    if (message === null) {
      console.warn('Cannot handle message')
      console.warn(event)
      return
    }

    const { replyToken } = event

    // Reply to the user.
    await getClient().replyMessage(replyToken, message)
  }
  if (event.type !== 'message') {
    return
  }
}
