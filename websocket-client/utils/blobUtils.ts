import { Message } from '@/types/message'

export const revokeBlobUrlSafely = (url: string): void => {
  try {
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error revoking blob URL:', error)
  }
}

export const revokeAllBlobUrls = (blobUrls: Set<string>): void => {
  Array.from(blobUrls).map(revokeBlobUrlSafely)
  blobUrls.clear()
}

export const extractBlobUrlsFromMessages = (
  messages: Message[],
): Set<string> => {
  return new Set(
    messages
      .filter((msg) => msg.type === 'audio' && msg.payload?.startsWith('blob:'))
      .map((msg) => msg.payload)
      .filter((payload): payload is string => typeof payload === 'string'),
  )
}

export const cleanupBlobUrlsOnUnmount = (
  blobUrlsRef: React.RefObject<Set<string>>,
  previousAudioUrlRef: React.RefObject<string | null>,
): void => {
  if (blobUrlsRef.current) {
    revokeAllBlobUrls(blobUrlsRef.current)
  }

  if (previousAudioUrlRef.current) {
    revokeBlobUrlSafely(previousAudioUrlRef.current)
    previousAudioUrlRef.current = null
  }
}

export const syncBlobUrlsWithMessages = (
  messages: Message[],
  blobUrlsRef: React.RefObject<Set<string>>,
): void => {
  const currentBlobUrls = extractBlobUrlsFromMessages(messages)

  if (!blobUrlsRef.current) {
    return
  }
  const urlsToRemove = Array.from(blobUrlsRef.current).filter((url) => !currentBlobUrls.has(url))
  urlsToRemove.forEach((url) => {
    revokeBlobUrlSafely(url)
    blobUrlsRef.current?.delete(url)
  })

  currentBlobUrls.forEach((url) => {
    if (!blobUrlsRef.current?.has(url)) {
      blobUrlsRef.current?.add(url)
    }
  })
}
