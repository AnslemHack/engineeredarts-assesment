import { OpenAI } from 'openai';
import { logger } from './logger.js';
export class TtsServiceCaller {
    openai;
    model;
    constructor(openAiApiKey, model) {
        this.openai = new OpenAI({
            apiKey: openAiApiKey,
        });
        this.model = model;
    }
    async convertTextToSpeech(text, onChunk, voice = 'alloy') {
        try {
            const response = await this.openai.audio.speech.create({
                model: this.model,
                voice: voice,
                input: text,
            });
            if (response.body) {
                const synthesisedAudioChunk = await response.arrayBuffer();
                onChunk(Buffer.from(synthesisedAudioChunk));
            }
        }
        catch (error) {
            logger.error('Error converting text to speech', error);
            throw error;
        }
    }
}
//# sourceMappingURL=TtsService.js.map