import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { VoicePipelineService } from '../../src/services/voicePipelineService.js';
describe('VoicePipelineService', () => {
    let mockLlmService;
    let mockTtsService;
    let voicePipelineService;
    let ttsCallCount;
    let ttsCallArgs;
    let audioChunks;
    beforeEach(() => {
        ttsCallCount = 0;
        ttsCallArgs = [];
        audioChunks = [];
        mockLlmService = {
            streamResponse: async (prompt, onTextChunk) => { },
        };
        mockTtsService = {
            convertTextToSpeech: async (text, onChunk, voice) => {
                ttsCallCount++;
                ttsCallArgs.push({ text, voice: voice || 'alloy' });
                const audioBuffer = Buffer.from(`audio-for-${text}`);
                onChunk(audioBuffer);
                audioChunks.push(audioBuffer);
            },
        };
        voicePipelineService = new VoicePipelineService(mockLlmService, mockTtsService);
    });
    it('should process complete sentences and convert to speech', async () => {
        const onChunkCalls = [];
        const ttsCalls = [];
        const audioBuffer = Buffer.from('fake-audio-data');
        mockLlmService.streamResponse = async (prompt, onTextChunk) => {
            await onTextChunk('Hello world. ');
            await onTextChunk('How are you? ');
        };
        mockTtsService.convertTextToSpeech = async (text, onAudioChunk, voice) => {
            ttsCalls.push(text);
            onAudioChunk(audioBuffer);
        };
        await voicePipelineService.streamAudioResponse('Test prompt', (chunk) => onChunkCalls.push(chunk), undefined, 'alloy');
        expect(ttsCalls.length).to.equal(2);
        expect(ttsCalls[0]).to.equal('Hello world.');
        expect(ttsCalls[1]).to.equal('How are you?');
        expect(onChunkCalls.length).to.equal(2);
    });
    it('should buffer incomplete sentences until complete', async () => {
        let ttsCalls = [];
        mockLlmService.streamResponse = async (prompt, onTextChunk) => {
            await onTextChunk('Hello');
            await onTextChunk(' world.');
        };
        mockTtsService.convertTextToSpeech = async (text, onAudioChunk, voice) => {
            ttsCalls.push(text);
            onAudioChunk(Buffer.from('audio'));
        };
        await voicePipelineService.streamAudioResponse('Test prompt', () => { }, undefined, 'nova');
        expect(ttsCalls.length).to.equal(1);
        expect(ttsCalls[0]).to.equal('Hello world.');
    });
});
//# sourceMappingURL=voicePipelineService.test.js.map