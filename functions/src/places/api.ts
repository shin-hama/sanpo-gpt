import { Client, Language } from '@googlemaps/google-maps-services-js'
import { googleMapApiKey } from '../core/secrets'

const client = new Client({})

export async function nearbySearch(lat: number, lng: number, keywords: Array<string>) {
  let result
  try {
    result = await client.placesNearby({
      params: {
        location: { lat, lng },
        radius: 200,
        keyword: keywords.join(' '),
        key: googleMapApiKey.value(),
      },
    })
  } catch (e) {
    console.error(e)
    return
  }

  console.log(result.data.results)

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

export async function getDetails(placeId: string) {
  const place = await client.placeDetails({
    params: {
      place_id: placeId,
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
