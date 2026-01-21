import { Message } from '@/types/message'
import { MESSAGE_SENDER } from '@/constants/messageSenders'
import { revokeBlobUrlSafely } from '@/utils/blobUtils'

const cleanupPreviousAudioUrl = (
  previousAudioUrlRef: React.RefObject<string | null>,
  blobUrlsRef: React.RefObject<Set<string>>,
): void => {
  if (previousAudioUrlRef.current) {
    revokeBlobUrlSafely(previousAudioUrlRef.current)
    blobUrlsRef.current?.delete(previousAudioUrlRef.current)
    previousAudioUrlRef.current = null
  }
}

const initializeNewAudioMessage = (
  audioChunksRef: React.RefObject<Blob[]>,
  currentAudioMessageIdRef: React.RefObject<string | null>,
  previousAudioUrlRef: React.RefObject<string | null>,
  blobUrlsRef: React.RefObject<Set<string>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
): void => {
  const messageId = crypto.randomUUID()
  currentAudioMessageIdRef.current = messageId
  audioChunksRef.current = []

  cleanupPreviousAudioUrl(previousAudioUrlRef, blobUrlsRef)
  const newMessage: Message = {
    type: 'audio',
    messageId,
    payload: '',
    sender: MESSAGE_SENDER.ASSISTANT,
  }
  setMessages((prev) => [...prev, newMessage])
}

const combineAudioChunksIntoBlobUrl = (
  audioChunks: Blob[],
  previousAudioUrlRef: React.RefObject<string | null>,
  blobUrlsRef: React.RefObject<Set<string>>,
): string => {
  cleanupPreviousAudioUrl(previousAudioUrlRef, blobUrlsRef)

  const combinedBlob = new Blob(audioChunks, {
    type: 'audio/mpeg',
  })
  const audioUrl = URL.createObjectURL(combinedBlob)
  previousAudioUrlRef.current = audioUrl
  blobUrlsRef.current?.add(audioUrl)
  return audioUrl
}

const updateMessageWithAudioUrl = (
  messageId: string,
  audioUrl: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
): void => {
  setMessages((prev) => {
    const messageIndex = prev.findIndex((msg) => msg.messageId === messageId)
    if (messageIndex === -1) {
      return prev
    }
    const currentMessage = prev[messageIndex]
    if (currentMessage.payload === audioUrl) {
      return prev
    }
    const updatedMessages = [...prev]
    updatedMessages[messageIndex] = { ...currentMessage, payload: audioUrl }
    return updatedMessages
  })
}

export const createAudioChunkHandler = (
  audioChunksRef: React.RefObject<Blob[]>,
  currentAudioMessageIdRef: React.RefObject<string | null>,
  previousAudioUrlRef: React.RefObject<string | null>,
  blobUrlsRef: React.RefObject<Set<string>>,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  return (chunk: Blob) => {
    if (!currentAudioMessageIdRef.current) {
      initializeNewAudioMessage(
        audioChunksRef,
        currentAudioMessageIdRef,
        previousAudioUrlRef,
        blobUrlsRef,
        setMessages,
      )
    }

    audioChunksRef.current.push(chunk)
    const audioUrl = combineAudioChunksIntoBlobUrl(
      audioChunksRef.current,
      previousAudioUrlRef,
      blobUrlsRef,
    )

    if (currentAudioMessageIdRef.current) {
      updateMessageWithAudioUrl(
        currentAudioMessageIdRef.current,
        audioUrl,
        setMessages,
      )
    }
  }
}
