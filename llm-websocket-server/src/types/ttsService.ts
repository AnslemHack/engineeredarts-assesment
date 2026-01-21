export interface TtsService {
  convertTextToSpeech(
    text: string,
    onChunk: (chunk: Buffer) => void,
    voice?: string,
  ): Promise<void>
}
