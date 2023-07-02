import { onRequest } from 'firebase-functions/v2/https'
import { lineRouter } from './line'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const attendNearby = onRequest({}, async (req, res) => {
//   const place = await nearbySearch()
//   if (!place) {
//     res.status(200).json({
//       message: '見つかりませんでした',
//     })
//     return
//   }

//   const msg = `
//   The following json is a detailed description of a certain spot available on Api. Please summarize this information and introduce yourself to me as a tour attendant.

//   ${JSON.stringify(place)}
//   `
//   const reply = await chat_gpt35(msg)

//   res.status(200).json({
//     url: place.website,
//     map_url: place.url,
//     message: reply,
//   })
// })

export const line = onRequest(lineRouter)
