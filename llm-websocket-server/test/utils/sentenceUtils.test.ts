import { describe, it } from 'mocha'
import { expect } from 'chai'
import { extractCompleteSentences } from '../../src/utils/sentenceUtils.js'

describe('extractCompleteSentences', () => {
  it('should extract complete sentences ending with periods', () => {
    const buffer = 'Hello world. This is a test. How are you?'
    const result = extractCompleteSentences(buffer)

    expect(result.sentences).to.deep.equal([
      'Hello world.',
      'This is a test.',
      'How are you?',
    ])
    expect(result.remainingBuffer).to.equal('')
  })

  it('should handle partial sentences in buffer', () => {
    const buffer = 'First sentence. Second sentence. Incomplete'
    const result = extractCompleteSentences(buffer)

    expect(result.sentences).to.deep.equal(['First sentence.', 'Second sentence.'])
    expect(result.remainingBuffer).to.equal('Incomplete')
  })

  it('should handle empty buffer', () => {
    const result = extractCompleteSentences('')

    expect(result.sentences).to.deep.equal([])
    expect(result.remainingBuffer).to.equal('')
  })

  it('should handle buffer with only incomplete sentence', () => {
    const buffer = 'This is an incomplete sentence'
    const result = extractCompleteSentences(buffer)

    expect(result.sentences).to.deep.equal([])
    expect(result.remainingBuffer).to.equal('This is an incomplete sentence')
  })

  it('should handle multiple sentence endings (!, ?, .)', () => {
    const buffer = 'Hello! How are you? I am fine.'
    const result = extractCompleteSentences(buffer)

    expect(result.sentences).to.deep.equal(['Hello!', 'How are you?', 'I am fine.'])
    expect(result.remainingBuffer).to.equal('')
  })

  it('should preserve remaining buffer correctly with whitespace', () => {
    const buffer = 'First. Second.   Trailing text'
    const result = extractCompleteSentences(buffer)

    expect(result.sentences).to.deep.equal(['First.', 'Second.'])
    expect(result.remainingBuffer).to.equal('Trailing text')
  })
})

