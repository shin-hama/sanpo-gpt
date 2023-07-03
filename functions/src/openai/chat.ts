import { Configuration, OpenAIApi } from 'openai'
import { openAIApiKey } from '../core/secrets'

export async function chat_gpt35(message: string) {
  const configuration = new Configuration({
    apiKey: openAIApiKey.value(),
  })
  const openai = new OpenAIApi(configuration)

  const chat = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
  })
  console.log(chat.data.usage)

  return chat.data.choices[0].message
}
