import * as express from 'express'
import { getClient, lineMiddleware } from './client'
import { TextMessage, WebhookEvent } from '@line/bot-sdk'

const app = express()

const eventHandler = async (event: WebhookEvent) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return
  }

  // Process all message related variables here.
  const { replyToken } = event
  const { text } = event.message

  // Create a new message.
  const response: TextMessage = {
    type: 'text',
    text,
  }

  // Reply to the user.
  await getClient().replyMessage(replyToken, response)
}

app.post('/webhook', lineMiddleware, async (req, res) => {
  req.body.destination // user ID of the bot (optional)
  const events: WebhookEvent[] = req.body.events

  const results = await Promise.all(
    events.map(async (event) => {
      try {
        await eventHandler(event)
        return
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err)
        }

        // Return an error message.
        return res.status(500).json({
          status: 'error',
        })
      }
    })
  )

  // Return a successful message.
  return res.status(200).json({
    status: 'success',
    results,
  })
})
app.get('/hello', (req, res) => {
  res.json({ message: 'hello' })
})

export const lineRouter = app
