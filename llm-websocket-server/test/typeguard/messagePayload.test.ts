import { describe, it } from 'mocha'
import { expect } from 'chai'
import {
  messagePayloadSchema,
  formatValidationError,
} from '../../src/typeguard/messagePayload.js'

describe('messagePayloadSchema', () => {
  it('should validate a correct message payload', () => {
    const validPayload = {
      type: 'text',
      messageId: '123',
      payload: 'Hello world',
      sender: 'client',
      voiceType: 'alloy',
    }

    const result = messagePayloadSchema.safeParse(validPayload)

    expect(result.success).to.be.true
    if (result.success) {
      expect(result.data).to.deep.equal(validPayload)
    }
  })

  it('should reject invalid type', () => {
    const invalidPayload = {
      type: 'invalid',
      messageId: '123',
      payload: 'Hello',
      sender: 'client',
    }

    const result = messagePayloadSchema.safeParse(invalidPayload)

    expect(result.success).to.be.false
  })

  it('should reject empty payload', () => {
    const invalidPayload = {
      type: 'text',
      messageId: '123',
      payload: '',
      sender: 'client',
    }

    const result = messagePayloadSchema.safeParse(invalidPayload)

    expect(result.success).to.be.false
    if (!result.success) {
      expect(result.error.issues[0]?.message).to.include('cannot be empty')
    }
  })

  it('should accept optional voiceType', () => {
    const payloadWithoutVoice = {
      type: 'text',
      messageId: '123',
      payload: 'Hello',
      sender: 'client',
    }

    const result = messagePayloadSchema.safeParse(payloadWithoutVoice)

    expect(result.success).to.be.true
  })

  it('should reject invalid voiceType', () => {
    const invalidPayload = {
      type: 'text',
      messageId: '123',
      payload: 'Hello',
      sender: 'client',
      voiceType: 'invalid-voice',
    }

    const result = messagePayloadSchema.safeParse(invalidPayload)

    expect(result.success).to.be.false
  })
})

describe('formatValidationError', () => {
  it('should format validation error messages', () => {
    const invalidPayload = {
      type: 'text',
      messageId: '',
      payload: '',
    }

    const result = messagePayloadSchema.safeParse(invalidPayload)

    expect(result.success).to.be.false
    if (!result.success) {
      const errorMessage = formatValidationError(result.error)
      expect(errorMessage).to.include('Validation failed')
      expect(errorMessage).to.include('messageId')
    }
  })
})
