import { WebSocketServer } from '../types/websocketServer.js';
import { WebSocketServer as WebSocketServerType } from 'ws';
import { VoicePipelineService } from '../services/voicePipelineService.js';
import type { Server } from 'http';
export declare class voiceSocketManager implements WebSocketServer {
    private readonly wss;
    private readonly httpServer;
    private readonly connections;
    private readonly voicePipelineService;
    private readonly processingConnections;
    constructor(voicePipelineService: VoicePipelineService, wss: WebSocketServerType, httpServer: Server);
    start(): void;
    private handleConnection;
    private handleConnectionUpgrade;
    private sendMessage;
    private handleMessage;
}
//# sourceMappingURL=index.d.ts.map