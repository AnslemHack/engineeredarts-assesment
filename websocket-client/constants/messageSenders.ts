export const MESSAGE_SENDER = {
  CLIENT: 'client',
  ASSISTANT: 'assistant',
} as const

export type MessageSender = typeof MESSAGE_SENDER[keyof typeof MESSAGE_SENDER]
