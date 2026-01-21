import { OpenAI } from 'openai'
import { LlmService } from '../types/llmService.js'
import { logger } from './logger.js'

export class LlmServiceCaller implements LlmService {
  private readonly openai: OpenAI
  private readonly model: string

  constructor(openAiApiKey: string, model: string) {
    this.openai = new OpenAI({
      apiKey: openAiApiKey,
    })
    this.model = model
  }

  async streamResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    try {
      const stream = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      })

      for await (const chunk of stream) {
        if (signal?.aborted) {
          break
        }
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          onChunk(content)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      logger.error('Error streaming response', error)
    }
  }
}
