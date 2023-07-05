import { summarize_spot } from '../openai'
import { nearbySearch } from '../places'

export async function attendNearbyPlace(latitude: number, longitude: number, keywords = '') {
  const place = await nearbySearch(latitude, longitude, keywords)
  if (!place) {
    return null
  }

  const msg = JSON.stringify(place)
  const reply = await summarize_spot(msg)

  return reply || null
}
