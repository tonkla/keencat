import dialogflow from 'dialogflow'
import dotenv from 'dotenv'
import nanoid from 'nanoid'

import { IntentResponse } from './typings'

dotenv.config()

async function detectIntent(text: string): Promise<IntentResponse | null> {
  try {
    const projectId = process.env.DIALOGFLOW_ID || ''
    const client = new dialogflow.SessionsClient({ keyFilename: './key.json' })
    const session = client.sessionPath(projectId, nanoid(20))
    const request = {
      session,
      queryInput: {
        text: {
          text,
          languageCode: 'th',
        },
      },
    }
    const { queryResult } = (await client.detectIntent(request))[0]
    if (queryResult) {
      const { intent, fulfillmentText } = queryResult
      const response: IntentResponse = {
        type: intent.displayName,
        text: fulfillmentText,
      }
      return response
    }
    return null
  } catch (e) {
    return null
  }
}

export default {
  detectIntent,
}
