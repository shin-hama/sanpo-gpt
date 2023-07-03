import { TextMessage, WebhookEvent, MessageEvent, Message, TextEventMessage } from '@line/bot-sdk'
import { getClient } from './client'

export async function replyMessage(event: WebhookEvent) {
  if (event.type !== 'message') {
    return
  }

  const response = messageHandler(event)
  if (response === null) {
    console.warn('Cannot handle message')
    console.warn(event)
    return
  }

  const { replyToken } = event

  // Reply to the user.
  await getClient().replyMessage(replyToken, response)
}

const messageHandler = (event: MessageEvent): Message | null => {
  if (event.message.type === 'location') {
    console.log(event)
    return null
  } else if (event.message.type === 'text') {
    return textMessageHandler(event.message)
  }

  return null
}

const textMessageHandler = (message: TextEventMessage): TextMessage => {
  return {
    type: 'text',
    text: message.text,
  }
}
