import { ChatCompletionFunctions, Configuration, OpenAIApi } from 'openai'

import { openAIApiKey } from '~/core/secrets'
import { systemPrompt } from '~/core/prompt'

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

const functions: Array<ChatCompletionFunctions> = [
  {
    name: 'find_places',
    description:
      'A Find Place request takes a text input and returns a place. The input can be any kind of Places text data, such as a name, address, or phone number.',
    parameters: {
      type: 'object',
      properties: {
        keywords: {
          type: 'string',
          description:
            'The comma separated list of text string on which to search, for example: "restaurant" or "123 Main Street". This must be a place name, address, or category of establishments.',
        },
      },
    },
  },
]
/**
 * 任意のテキストメッセージを解析する
 * @param message テキストメッセージ
 */
export async function parseMessage(message: string) {
  const configuration = new Configuration({
    apiKey: openAIApiKey.value(),
  })
  const openai = new OpenAIApi(configuration)

  const chat = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    functions,
  })

  return chat.data.choices[0]
}
