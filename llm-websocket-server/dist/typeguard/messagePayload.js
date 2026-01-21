import { z } from 'zod';
export const messagePayloadSchema = z.object({
    type: z.enum(['text', 'audio']),
    messageId: z.string().min(1, 'messageId is required'),
    payload: z.string().min(1, 'payload is required and cannot be empty'),
    sender: z.enum(['client', 'assistant']),
    voiceType: z.enum(['alloy', 'nova', 'shimmer']).optional(),
});
export function formatValidationError(error) {
    const errorMessages = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
    return `Validation failed: ${errorMessages}`;
}
//# sourceMappingURL=messagePayload.js.map