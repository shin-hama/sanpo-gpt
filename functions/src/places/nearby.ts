import { defineSecret } from 'firebase-functions/params'
import { Client, Language } from '@googlemaps/google-maps-services-js'

const apiKey = defineSecret('GOOGLE_MAP_API_KEY')

const client = new Client({})

export async function nearbySearch() {
  const result = await client.placesNearby({
    params: {
      location: { lat: 35.6909056, lng: 139.4376704 },
      radius: 100,
      language: Language.ja,
      key: apiKey.value(),
    },
  })

  const places = result.data.results.filter((place) => place.rating)
  if (places.length === 0) {
    return null
  }
  const target = places[Math.floor(Math.random() * places.length)]

  if (target.place_id) {
    const place = await client.placeDetails({
      params: {
        place_id: target.place_id,
        language: Language.ja,
        fields: [
          'formatted_address',
          'name',
          'opening_hours',
          'rating',
          'reviews',
          'types',
          'url',
          'user_ratings_total',
          'website',
        ],
        key: apiKey.value(),
      },
    })

    return place.data.result
  }
  return null
}
