import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getPrompt } from '../../src/utils/promptUtils.js';
describe('getPrompt', () => {
    it('should include user message in prompt', () => {
        const message = 'What is the weather?';
        const prompt = getPrompt(message);
        expect(prompt).to.include(message);
        expect(prompt).to.include('helpful assistant');
        expect(prompt).to.include('respond to the user');
    });
    it('should handle empty message', () => {
        const prompt = getPrompt('');
        expect(prompt).to.be.a('string');
        expect(prompt.length).to.be.greaterThan(0);
    });
    it('should include language and content guidelines', () => {
        const prompt = getPrompt('Test message');
        expect(prompt).to.include('same language as the user');
        expect(prompt).to.include('not contain any vulgar words');
    });
});
//# sourceMappingURL=promptUtils.test.js.map