let socketInstance: WebSocket | null = null

export const createWebSocket = (url: string): WebSocket | null => {
  if (typeof window === 'undefined') {
    return null
  }

  if (socketInstance) {
    const state = socketInstance.readyState
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
      return socketInstance
    }
    socketInstance = null
  }

  socketInstance = new WebSocket(url)
  return socketInstance
}

export const resetWebSocketInstance = (): void => {
  socketInstance = null
}
