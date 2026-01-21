import { Message, MessageType, MessageHandler } from '@/types/message'

export const isAudioMessage = (message: Message): boolean => {
  return (
    message.type === 'audio' &&
    typeof message.payload === 'string' &&
    message.payload.trim() !== ''
  )
}

export const getAudioUrl = (message: Message): string | null => {
  if (isAudioMessage(message)) {
    return message.payload
  }
  return null
}

export const isBlobUrl = (url: string | null): boolean => {
  return url !== null && url.startsWith('blob:')
}

export const getMessageType = (data: unknown): MessageType => {
  if (data instanceof Blob || data instanceof ArrayBuffer) {
    return 'audio'
  }
  return 'text'
}

export const handleMessageByType = (
  event: MessageEvent,
  handlers: MessageHandler,
) => {
  const messageType = getMessageType(event.data)

  const handlerMap: Record<MessageType, () => void> = {
    audio: () => {
      const handler = handlers.audio
      if (handler) {
        const blob =
          event.data instanceof Blob ? event.data : new Blob([event.data])
        handler(blob)
      } else {
        console.warn('No handler found for audio messages')
      }
    },
    text: () => {
      const handler = handlers.text
      if (handler && typeof event.data === 'string') {
        handler(event.data)
      } else {
        console.warn('No handler found for text messages')
      }
    },
  }

  try {
    const handler = handlerMap[messageType]
    if (handler) {
      handler()
    }
  } catch (error) {
    console.error('Error handling message:', error)
  }
}
