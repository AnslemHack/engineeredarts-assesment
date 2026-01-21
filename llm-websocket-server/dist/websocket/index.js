import { WebSocket } from 'ws';
import { logger } from '../services/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { getPrompt } from '../utils/promptUtils.js';
import { messagePayloadSchema, formatValidationError, } from '../typeguard/messagePayload.js';
export class voiceSocketManager {
    wss;
    httpServer;
    connections = new Map();
    voicePipelineService;
    processingConnections = new Set();
    constructor(voicePipelineService, wss, httpServer) {
        this.voicePipelineService = voicePipelineService;
        this.wss = wss;
        this.httpServer = httpServer;
    }
    start() {
        logger.info('starting WebSocket server');
        this.httpServer.on('upgrade', this.handleConnectionUpgrade.bind(this));
        this.wss.on('connection', this.handleConnection.bind(this));
        logger.info('WebSocket server started');
    }
    handleConnection(ws) {
        const connectionId = uuidv4();
        this.connections.set(connectionId, ws);
        logger.info(`Connection established: ${connectionId}`);
        ws.on('message', (message) => {
            this.handleMessage(ws, message);
        });
    }
    handleConnectionUpgrade(request, socket, head) {
        if (request.method !== 'GET') {
            logger.warn(`Invalid upgrade request method: ${request.method}`);
            socket.write('HTTP/1.1 405 Method Not Allowed\r\n\r\n');
            socket.destroy();
            return;
        }
        const upgradeHeader = request.headers.upgrade;
        if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
            logger.warn('Missing or invalid Upgrade header');
            socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
            socket.destroy();
            return;
        }
        const connectionHeader = request.headers.connection;
        if (!connectionHeader ||
            !connectionHeader.toLowerCase().includes('upgrade')) {
            logger.warn('Missing or invalid Connection header');
            socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
            socket.destroy();
            return;
        }
        if (!request.headers['sec-websocket-key']) {
            logger.warn('Missing Sec-WebSocket-Key header');
            socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
            socket.destroy();
            return;
        }
        // Security checks (out of scope for this implementation):
        // - Origin/CORS validation: Validate the Origin header to prevent CSRF attacks
        // - Authentication/Authorization: Verify user tokens, API keys, or session cookies
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            this.wss.emit('connection', ws);
        });
    }
    sendMessage(ws, message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    }
    async handleMessage(ws, message) {
        if (this.processingConnections.has(ws)) {
            logger.info('Message ignored: already processing a request for this connection');
            return;
        }
        try {
            this.processingConnections.add(ws);
            const parsedData = JSON.parse(message.toString());
            const validationResult = messagePayloadSchema.safeParse(parsedData);
            if (!validationResult.success) {
                const errorMessage = formatValidationError(validationResult.error);
                logger.error(errorMessage, validationResult.error);
                return;
            }
            const { payload, voiceType } = validationResult?.data || {};
            const prompt = getPrompt(payload);
            await this.voicePipelineService.streamAudioResponse(prompt, (chunk) => {
                this.sendMessage(ws, chunk);
            }, undefined, voiceType);
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                logger.error('Invalid JSON format in message', error);
            }
            else {
                logger.error('Error handling message', error);
            }
        }
        finally {
            this.processingConnections.delete(ws);
        }
    }
}
//# sourceMappingURL=index.js.map