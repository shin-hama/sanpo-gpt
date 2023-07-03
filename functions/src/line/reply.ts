import {
  TextMessage,
  WebhookEvent,
  MessageEvent,
  Message,
  TextEventMessage,
  LocationEventMessage,
} from '@line/bot-sdk'
import { getClient } from './client'
import { nearbySearch } from '../places'
import { summarize_spot } from '../openai'

export async function replyMessage(event: WebhookEvent) {
  if (event.type !== 'message') {
    return
  }

  const response = await messageHandler(event)

  if (response === null) {
    console.warn('Cannot handle message')
    console.warn(event)
    return
  }

  const { replyToken } = event

  // Reply to the user.
  await getClient().replyMessage(replyToken, response)
}

const messageHandler = async (event: MessageEvent): Promise<Message | null> => {
  if (event.message.type === 'location') {
    return await locationMessageHandler(event.message)
  } else if (event.message.type === 'text') {
    return textMessageHandler(event.message)
  }

  return null
}

const locationMessageHandler = async (message: LocationEventMessage): Promise<TextMessage> => {
  const place = await nearbySearch(message.latitude, message.longitude)
  if (!place) {
    return {
      type: 'text',
      text: '見つかりませんでした',
    }
  }

  const msg = JSON.stringify(place)
  const reply = await summarize_spot(msg)

  return {
    type: 'text',
    text: reply?.content || 'No Message',
  }
}

const textMessageHandler = (message: TextEventMessage): TextMessage => {
  console.log(message.text)
  return {
    type: 'text',
    text: 'テキストチャットは現在開発中です。位置情報を送信してください。',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'location',
            label: 'Send Location',
          },
        },
      ],
    },
  }
}
