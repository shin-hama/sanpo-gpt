import * as express from 'express'
import { WebhookEvent } from '@line/bot-sdk'

import { lineMiddleware } from './client'
import { webhookHandler } from './webhook'

const app = express()

app.post('/webhook', lineMiddleware, async (req, res) => {
  const events: WebhookEvent[] = req.body.events

  const results = await Promise.all(
    events.map(async (event) => {
      try {
        await webhookHandler(event)
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

export const lineRouter = app
