export interface LlmService {
  streamResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal,
  ): Promise<void>
}
