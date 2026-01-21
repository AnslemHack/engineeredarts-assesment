import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'
import { VoicePipelineService } from '../../src/services/voicePipelineService.js'
import type { LlmService } from '../../src/types/llmService.js'
import type { TtsService } from '../../src/types/ttsService.js'

describe('VoicePipelineService', () => {
  let mockLlmService: LlmService
  let mockTtsService: TtsService
  let voicePipelineService: VoicePipelineService
  let ttsCallCount: number
  let ttsCallArgs: Array<{ text: string; voice: string }>
  let audioChunks: Buffer[]

  beforeEach(() => {
    ttsCallCount = 0
    ttsCallArgs = []
    audioChunks = []

    mockLlmService = {
      streamResponse: async (
        prompt: string,
        onTextChunk: (chunk: string) => void,
      ) => {},
    }
    mockTtsService = {
      convertTextToSpeech: async (
        text: string,
        onChunk: (chunk: Buffer) => void,
        voice?: string,
      ) => {
        ttsCallCount++
        ttsCallArgs.push({ text, voice: voice || 'alloy' })
        const audioBuffer = Buffer.from(`audio-for-${text}`)
        onChunk(audioBuffer)
        audioChunks.push(audioBuffer)
      },
    }

    voicePipelineService = new VoicePipelineService(
      mockLlmService,
      mockTtsService,
    )
  })

  it('should process complete sentences and convert to speech', async () => {
    const onChunkCalls: Buffer[] = []
    const ttsCalls: string[] = []
    const audioBuffer = Buffer.from('fake-audio-data')

    mockLlmService.streamResponse = async (
      prompt: string,
      onTextChunk: (chunk: string) => void,
    ) => {
      await onTextChunk('Hello world. ')
      await onTextChunk('How are you? ')
    }

    mockTtsService.convertTextToSpeech = async (
      text: string,
      onAudioChunk: (chunk: Buffer) => void,
      voice?: string,
    ) => {
      ttsCalls.push(text)
      onAudioChunk(audioBuffer)
    }

    await voicePipelineService.streamAudioResponse(
      'Test prompt',
      (chunk) => onChunkCalls.push(chunk),
      undefined,
      'alloy',
    )

    expect(ttsCalls.length).to.equal(2)
    expect(ttsCalls[0]).to.equal('Hello world.')
    expect(ttsCalls[1]).to.equal('How are you?')
    expect(onChunkCalls.length).to.equal(2)
  })

  it('should buffer incomplete sentences until complete', async () => {
    let ttsCalls: string[] = []

    mockLlmService.streamResponse = async (
      prompt: string,
      onTextChunk: (chunk: string) => void,
    ) => {
      await onTextChunk('Hello')
      await onTextChunk(' world.')
    }

    mockTtsService.convertTextToSpeech = async (
      text: string,
      onAudioChunk: (chunk: Buffer) => void,
      voice?: string,
    ) => {
      ttsCalls.push(text)
      onAudioChunk(Buffer.from('audio'))
    }

    await voicePipelineService.streamAudioResponse(
      'Test prompt',
      () => {},
      undefined,
      'nova',
    )
    expect(ttsCalls.length).to.equal(1)
    expect(ttsCalls[0]).to.equal('Hello world.')
  })
})
