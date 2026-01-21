import dotenv from 'dotenv'
dotenv.config()
import { logger } from '../services/logger.js'
const openAiApiKey = process.env.OPENAI_API_KEY

if (!openAiApiKey || openAiApiKey.trim() === '') {
  logger.error('ERROR: OPENAI_API_KEY is required but not provided.')
  process.exit(1)
}

export const config = {
  openAiApiKey: openAiApiKey,
  port: process.env.PORT,
  llmModel: process.env.LLM_MODEL || 'gpt-4o-mini',
  ttsModel: process.env.TTS_MODEL || 'tts-1',
}
