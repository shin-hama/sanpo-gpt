import {
  MessageEvent,
  Message,
  TextEventMessage,
  LocationEventMessage,
  EventMessage,
} from '@line/bot-sdk'

import { attendNearbyPlace } from '../../services/attendNearbyPlace'
import { User, upsertUser } from '../../firestore'
import { parseMessage } from '../../openai/chat'

// message type が text か location 以外の場合は無視する
const notSupportedMessage = (message: EventMessage): boolean => {
  return message.type !== 'text' && message.type !== 'location'
}

const requestLocationMessage: Message = {
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

export async function messageEventHandler(
  event: MessageEvent
): Promise<Message | Message[] | null> {
  if (notSupportedMessage(event.message)) {
    return {
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
  }

  return await handlerImpl(event)
}

const buildResponse = (address: string, keywords: User['keywords']) => {
  const keywordMsg = keywords ? `「${keywords}」に関する` : ''

  return `「${address}」付近の${keywordMsg}おすすめスポットを検索しました。}`
}

const handlerImpl = async (event: MessageEvent): Promise<Message | Message[] | null> => {
  const result = await messageHandler(event.message)
  if (result?.action === 'find_place') {
    const { params } = result

    if (event.source.userId) {
      const user = await upsertUser(event.source.userId, { ...params })

      if (user?.location) {
        const reply = await attendNearbyPlace(user.location.lat, user.location.lng, user.keywords)
        if (!reply) {
          return {
            type: 'text',
            text: '見つかりませんでした',
          }
        }

        return [
          {
            type: 'text',
            text: buildResponse(user.location.address, user.keywords),
          },
          {
            type: 'text',
            text: reply.content || 'No Message',
          },
        ]
      } else {
        return requestLocationMessage
      }
    } else if (params.location) {
      const reply = await attendNearbyPlace(
        params.location.lat,
        params.location.lng,
        params.keywords
      )
      if (!reply) {
        return {
          type: 'text',
          text: '見つかりませんでした',
        }
      }

      return [
        {
          type: 'text',
          text: buildResponse(params.location.address, params.keywords),
        },
        {
          type: 'text',
          text: reply.content || 'No Message',
        },
      ]
    }

    return requestLocationMessage
  } else if (result?.action === 'reply') {
    return { type: 'text', text: result.params.message }
  }

  return requestLocationMessage
}

type NextAction =
  | {
      action: 'find_place'
      params: Pick<User, 'keywords' | 'location'>
    }
  | {
      action: 'reply'
      params: { message: string }
    }

const messageHandler = async (message: EventMessage): Promise<NextAction | null> => {
  if (message.type === 'location') {
    return locationMessageHandler(message)
  } else if (message.type === 'text') {
    return await textMessageHandler(message)
  }
  return null
}

const locationMessageHandler = (message: LocationEventMessage): NextAction => {
  return {
    action: 'find_place',
    params: {
      location: {
        lat: message.latitude,
        lng: message.longitude,
        address: message.address,
      },
    },
  }
}

const textMessageHandler = async (message: TextEventMessage): Promise<NextAction> => {
  const result = await parseMessage(message.text)

  if (result.finish_reason === 'function_call') {
    const args = JSON.parse(result.message?.function_call?.arguments || '')
    if (typeof args === 'object' && args.keywords && typeof args.keywords === 'string') {
      return {
        action: 'find_place',
        params: {
          keywords: args.keywords,
        },
      }
    } else {
      return {
        action: 'reply',
        params: {
          message: result.message?.content || 'No Message',
        },
      }
    }
  } else {
    return {
      action: 'reply',
      params: {
        message: result.message?.content || 'No Message',
      },
    }
  }
}
