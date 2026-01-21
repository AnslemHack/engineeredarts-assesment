import { TtsService } from '../types/ttsService.js';
export declare class TtsServiceCaller implements TtsService {
    private readonly openai;
    private readonly model;
    constructor(openAiApiKey: string, model: string);
    convertTextToSpeech(text: string, onChunk: (chunk: Buffer) => void, voice?: string): Promise<void>;
}
//# sourceMappingURL=TtsService.d.ts.map