import { voiceSocketManager as VoiceSocketManager } from './websocket/index.js'
import { LlmServiceCaller } from './services/llmservice.js'
import { TtsServiceCaller } from './services/TtsService.js'
import { VoicePipelineService } from './services/voicePipelineService.js'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { config } from './config/index.js'

const { openAiApiKey, port, llmModel, ttsModel } = config
const serverPort = port

const httpServer = createServer()
const wss = new WebSocketServer({ noServer: true })

const llmService = new LlmServiceCaller(openAiApiKey, llmModel)
const ttsService = new TtsServiceCaller(openAiApiKey, ttsModel)
const voicePipelineService = new VoicePipelineService(llmService, ttsService)
const voiceSocketManager = new VoiceSocketManager(voicePipelineService,wss,httpServer)

voiceSocketManager.start()
httpServer.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`)
})
