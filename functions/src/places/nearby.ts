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

  result.data.results.forEach((element) => {
    console.log({ name: element.name, type: element.types, rate: element.rating })
  })
}
