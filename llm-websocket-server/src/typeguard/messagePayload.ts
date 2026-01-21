import { z } from 'zod'

export const messagePayloadSchema = z.object({
  type: z.enum(['text', 'audio']),
  messageId: z.string().min(1, 'messageId is required'),
  payload: z.string().min(1, 'payload is required and cannot be empty'),
  sender: z.enum(['client', 'assistant']),
  voiceType: z.enum(['alloy', 'nova', 'shimmer']).optional(),
})

export type MessagePayload = z.infer<typeof messagePayloadSchema>

export function formatValidationError(error: z.ZodError): string {
  const errorMessages = error.issues
    .map((err) => `${err.path.join('.')}: ${err.message}`)
    .join(', ')
  return `Validation failed: ${errorMessages}`
}
