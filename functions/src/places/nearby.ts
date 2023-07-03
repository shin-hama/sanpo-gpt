import { Client, Language } from '@googlemaps/google-maps-services-js'
import { googleMapApiKey } from '../core/secrets'

const client = new Client({})

export async function nearbySearch(lat: number, lng: number) {
  const result = await client.placesNearby({
    params: {
      location: { lat, lng },
      radius: 100,
      language: Language.ja,
      key: googleMapApiKey.value(),
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
        key: googleMapApiKey.value(),
      },
    })

    return place.data.result
  }
  return null
}
