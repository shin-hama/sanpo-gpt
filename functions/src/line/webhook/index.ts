import { WebhookEvent } from '@line/bot-sdk'

import { getClient } from '~/line/client'
import { messageEventHandler } from './message'
import { deleteUser } from '~/firestore'

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
  } else if (event.type === 'unfollow' || event.type === 'leave') {
    if (event.source.userId) {
      await deleteUser(event.source.userId)
    }
  } else {
    console.log(`Receive not supported message`)
    console.log(event)
    return
  }
}
