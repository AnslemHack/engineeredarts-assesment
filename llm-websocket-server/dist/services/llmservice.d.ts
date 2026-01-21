import { LlmService } from '../types/llmService.js';
export declare class LlmServiceCaller implements LlmService {
    private readonly openai;
    private readonly model;
    constructor(openAiApiKey: string, model: string);
    streamResponse(prompt: string, onChunk: (chunk: string) => void, signal?: AbortSignal): Promise<void>;
}
//# sourceMappingURL=llmservice.d.ts.map