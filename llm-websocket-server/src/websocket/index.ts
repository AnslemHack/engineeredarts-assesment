import { WebSocketServer } from '../types/websocketServer.js'
import { WebSocketServer as WebSocketServerType, WebSocket } from 'ws'
import { VoicePipelineService } from '../services/voicePipelineService.js'
import { logger } from '../services/logger.js'
import type { IncomingMessage } from 'http'
import type { Server } from 'http'
import type { Socket } from 'net'
import { v4 as uuidv4 } from 'uuid'
import { getPrompt } from '../utils/promptUtils.js'
import {
  messagePayloadSchema,
  formatValidationError,
} from '../typeguard/messagePayload.js'

export class voiceSocketManager implements WebSocketServer {
  private readonly wss: WebSocketServerType
  private readonly httpServer: Server
  private readonly connections: Map<string, WebSocket> = new Map()
  private readonly voicePipelineService: VoicePipelineService
  private readonly processingConnections: Set<WebSocket> = new Set()

  constructor(
    voicePipelineService: VoicePipelineService,
    wss: WebSocketServerType,
    httpServer: Server,
  ) {
    this.voicePipelineService = voicePipelineService
    this.wss = wss
    this.httpServer = httpServer
  }

  public start(): void {
    logger.info('starting WebSocket server')
    this.httpServer.on('upgrade', this.handleConnectionUpgrade.bind(this))
    this.wss.on('connection', this.handleConnection.bind(this))
    logger.info('WebSocket server started')
  }

  private handleConnection(ws: WebSocket): void {
    const connectionId = uuidv4()
    this.connections.set(connectionId, ws)
    logger.info(`Connection established: ${connectionId}`)
    ws.on('message', (message: Buffer) => {
      this.handleMessage(ws, message)
    })
  }

  private handleConnectionUpgrade(
    request: IncomingMessage,
    socket: Socket,
    head: Buffer,
  ): void {
    if (request.method !== 'GET') {
      logger.warn(`Invalid upgrade request method: ${request.method}`)
      socket.write('HTTP/1.1 405 Method Not Allowed\r\n\r\n')
      socket.destroy()
      return
    }
    const upgradeHeader = request.headers.upgrade
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
      logger.warn('Missing or invalid Upgrade header')
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n')
      socket.destroy()
      return
    }
    const connectionHeader = request.headers.connection
    if (
      !connectionHeader ||
      !connectionHeader.toLowerCase().includes('upgrade')
    ) {
      logger.warn('Missing or invalid Connection header')
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n')
      socket.destroy()
      return
    }

    if (!request.headers['sec-websocket-key']) {
      logger.warn('Missing Sec-WebSocket-Key header')
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n')
      socket.destroy()
      return
    }

    // Security checks (out of scope for this implementation):
    // - Origin/CORS validation: Validate the Origin header to prevent CSRF attacks
    // - Authentication/Authorization: Verify user tokens, API keys, or session cookies

    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit('connection', ws)
    })
  }

  private sendMessage(ws: WebSocket, message: string | Buffer): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message)
    }
  }

  private async handleMessage(ws: WebSocket, message: Buffer): Promise<void> {
    if (this.processingConnections.has(ws)) {
      logger.info(
        'Message ignored: already processing a request for this connection',
      )
      return
    }

    try {
      this.processingConnections.add(ws)
      const parsedData = JSON.parse(message.toString())
      const validationResult = messagePayloadSchema.safeParse(parsedData)

      if (!validationResult.success) {
        const errorMessage = formatValidationError(validationResult.error)
        logger.error(errorMessage, validationResult.error)
        return
      }

      const { payload, voiceType } = validationResult?.data || {}
      const prompt = getPrompt(payload)
      await this.voicePipelineService.streamAudioResponse(
        prompt,
        (chunk: Buffer) => {
          this.sendMessage(ws, chunk)
        },
        undefined,
        voiceType,
      )
    } catch (error) {
      if (error instanceof SyntaxError) {
        logger.error('Invalid JSON format in message', error)
      } else {
        logger.error('Error handling message', error)
      }
    } finally {
      this.processingConnections.delete(ws)
    }
  }
}
