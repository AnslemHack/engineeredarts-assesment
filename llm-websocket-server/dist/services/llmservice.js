import { OpenAI } from 'openai';
import { logger } from './logger.js';
export class LlmServiceCaller {
    openai;
    model;
    constructor(openAiApiKey, model) {
        this.openai = new OpenAI({
            apiKey: openAiApiKey,
        });
        this.model = model;
    }
    async streamResponse(prompt, onChunk, signal) {
        try {
            const stream = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            });
            for await (const chunk of stream) {
                if (signal?.aborted) {
                    break;
                }
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    onChunk(content);
                }
            }
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            logger.error('Error streaming response', error);
        }
    }
}
//# sourceMappingURL=llmservice.js.map