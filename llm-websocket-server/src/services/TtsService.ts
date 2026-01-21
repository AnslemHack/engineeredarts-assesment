import { OpenAI } from 'openai'
import { TtsService } from '../types/ttsService.js'
import { logger } from './logger.js'

export class TtsServiceCaller implements TtsService {
  private readonly openai: OpenAI
  private readonly model: string

  constructor(openAiApiKey: string, model: string) {
    this.openai = new OpenAI({
      apiKey: openAiApiKey,
    })
    this.model = model
  }

  async convertTextToSpeech(
    text: string,
    onChunk: (chunk: Buffer) => void,
    voice: string = 'alloy',
  ): Promise<void> {
    try {
      const response = await this.openai.audio.speech.create({
        model: this.model,
        voice: voice,
        input: text,
      })

      if (response.body) {
        const synthesisedAudioChunk = await response.arrayBuffer()
        onChunk(Buffer.from(synthesisedAudioChunk))
      }
    } catch (error) {
      logger.error('Error converting text to speech', error)
      throw error
    }
  }
}
