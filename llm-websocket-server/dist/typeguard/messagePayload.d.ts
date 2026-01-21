import { z } from 'zod';
export declare const messagePayloadSchema: z.ZodObject<{
    type: z.ZodEnum<{
        text: "text";
        audio: "audio";
    }>;
    messageId: z.ZodString;
    payload: z.ZodString;
    sender: z.ZodEnum<{
        client: "client";
        assistant: "assistant";
    }>;
    voiceType: z.ZodOptional<z.ZodEnum<{
        alloy: "alloy";
        nova: "nova";
        shimmer: "shimmer";
    }>>;
}, z.core.$strip>;
export type MessagePayload = z.infer<typeof messagePayloadSchema>;
export declare function formatValidationError(error: z.ZodError): string;
//# sourceMappingURL=messagePayload.d.ts.map