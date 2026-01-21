import { LlmService } from '../types/llmService.js'
import { TtsService } from '../types/ttsService.js'
import { logger } from './logger.js'
import { extractCompleteSentences } from '../utils/sentenceUtils.js'

export class VoicePipelineService {
  private sentenceBuffer: string = ''
  private voice: string = 'alloy'

  constructor(
    private readonly llmService: LlmService,
    private readonly ttsService: TtsService,
  ) {}

  private async processTextChunk(
    textChunk: string,
    onChunk: (chunk: Buffer) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    if (signal?.aborted) {
      return
    }

    this.sentenceBuffer += textChunk
    const { sentences, remainingBuffer } = extractCompleteSentences(
      this.sentenceBuffer,
    )
    this.sentenceBuffer = remainingBuffer
    for (const sentence of sentences) {
      if (signal?.aborted) {
        break
      }

      await this.ttsService.convertTextToSpeech(
        sentence,
        (audioChunk) => {
          if (!signal?.aborted) {
            onChunk(audioChunk)
          }
        },
        this.voice,
      )
    }
  }

  async streamAudioResponse(
    prompt: string,
    onChunk: (chunk: Buffer) => void,
    signal?: AbortSignal,
    voice?: string,
  ): Promise<void> {
    try {
      this.sentenceBuffer = ''
      this.voice = voice || 'alloy'

      await this.llmService.streamResponse(
        prompt,
        async (textChunk: string) => {
          await this.processTextChunk(textChunk, onChunk, signal)
        },
        signal,
      )

      if (this.sentenceBuffer.trim() && !signal?.aborted) {
        await this.ttsService.convertTextToSpeech(
          this.sentenceBuffer.trim(),
          (audioChunk) => {
            if (!signal?.aborted) {
              onChunk(audioChunk)
            }
          },
          this.voice,
        )
        this.sentenceBuffer = ''
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('Aborting voice streaming')
        return
      }
      logger.error('Error streaming voice', error)
      throw error
    }
  }
}
