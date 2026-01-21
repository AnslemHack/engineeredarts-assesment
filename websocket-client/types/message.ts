import { MessageSender } from '@/constants/messageSenders'

export type MessageType = 'text' | 'audio'

export interface Message {
  type: MessageType
  messageId: string
  payload: string
  sender: MessageSender
  voiceType?: VoiceType
}

export interface MessageHandler {
  text?: (data: string) => void
  audio?: (chunk: Blob) => void
  error?: (error: string) => void
  unknown?: (data: unknown) => void
}

export type VoiceType = 'alloy' | 'nova' | 'shimmer'
