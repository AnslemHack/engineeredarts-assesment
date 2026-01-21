export interface TtsService {
    convertTextToSpeech(text: string, onChunk: (chunk: Buffer) => void, voice?: string, signal?: AbortSignal, timeout?: number): Promise<void>;
}
//# sourceMappingURL=ttsService.d.ts.map