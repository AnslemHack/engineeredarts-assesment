export interface LlmService {
    streamResponse(prompt: string, onChunk: (chunk: string) => void, signal?: AbortSignal, timeout?: number): Promise<void>;
}
//# sourceMappingURL=llmService.d.ts.map