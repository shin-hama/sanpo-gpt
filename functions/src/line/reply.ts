import {
  WebhookEvent,
  MessageEvent,
  Message,
  TextEventMessage,
  LocationEventMessage,
  EventMessage,
} from '@line/bot-sdk'
import { getClient } from './client'
import { attendNearbyPlace } from '../services/attendNearbyPlace'
import { User, upsertUser } from '../firestore'

export async function replyMessage(event: WebhookEvent) {
  if (event.type !== 'message') {
    return
  }

  if (event.message.type !== 'location') {
    const message: Message = {
      type: 'text',
      text: 'この機能は現在開発中です。位置情報を送信してください。',
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
    await getClient().replyMessage(event.replyToken, message)
  }

  const response = await eventHandler(event)

  if (response === null) {
    console.warn('Cannot handle message')
    console.warn(event)
    return
  }

  const { replyToken } = event

  // Reply to the user.
  await getClient().replyMessage(replyToken, response)
}

const eventHandler = async (event: MessageEvent): Promise<Message | null> => {
  const query = messageHandler(event.message)

  if (event.source.userId) {
    const user = await upsertUser(event.source.userId, { ...query })

    if (user?.location) {
      const reply = await attendNearbyPlace(
        user?.location?.lat,
        user?.location?.lng,
        user?.keywords
      )
      if (!reply) {
        return {
          type: 'text',
          text: '見つかりませんでした',
        }
      }

      return {
        type: 'text',
        text: reply?.content || 'No Message',
      }
    } else {
      return {
        type: 'text',
        text: '位置情報が取得できませんでした。まずは位置情報を共有してください。',
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
  }

  return null
}

const messageHandler = (message: EventMessage): Pick<User, 'keywords' | 'location'> | null => {
  if (message.type === 'location') {
    const location = locationMessageHandler(message)
    return {
      location,
    }
  } else if (message.type === 'text') {
    const keywords = textMessageHandler(message)
    return {
      keywords,
    }
  }
  return null
}

const locationMessageHandler = (message: LocationEventMessage): User['location'] => {
  return {
    lat: message.latitude,
    lng: message.longitude,
  }
}

const textMessageHandler = (message: TextEventMessage): User['keywords'] => {
  console.log(message.text)
  return []
}
