import { Configuration, OpenAIApi } from 'openai'

import { openAIApiKey } from '../core/secrets'
import { systemPrompt } from '../core/prompt'

export async function summarize_spot(message: string) {
  const configuration = new Configuration({
    apiKey: openAIApiKey.value(),
  })
  const openai = new OpenAIApi(configuration)

  const chat = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  })
  console.log(chat.data.usage)

  return chat.data.choices[0].message
}
