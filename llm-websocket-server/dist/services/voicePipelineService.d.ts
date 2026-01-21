import { LlmService } from '../types/llmService.js';
import { TtsService } from '../types/ttsService.js';
export declare class VoicePipelineService {
    private readonly llmService;
    private readonly ttsService;
    private sentenceBuffer;
    private voice;
    constructor(llmService: LlmService, ttsService: TtsService);
    private processTextChunk;
    streamAudioResponse(prompt: string, onChunk: (chunk: Buffer) => void, signal?: AbortSignal, voice?: string): Promise<void>;
}
//# sourceMappingURL=voicePipelineService.d.ts.map