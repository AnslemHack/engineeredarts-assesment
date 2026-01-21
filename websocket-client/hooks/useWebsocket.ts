import { createWebSocket, resetWebSocketInstance } from '@/lib/createWebSocket'
import { getServerUrl } from '@/utils/getserverUrl'
import { calculateReconnectDelay } from '@/utils/websocketUtils'
import { useEffect, useRef, useCallback, useState } from 'react'

const MAX_RECONNECT_ATTEMPTS = 5
const INITIAL_RECONNECT_DELAY = 1000
const MAX_RECONNECT_DELAY = 30000

export const useWebsocket = (onMessage: (event: MessageEvent) => void) => {
  const socketRef = useRef<WebSocket | null>(null)
  const onMessageRef = useRef(onMessage)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const shouldReconnectRef = useRef(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const connectRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  const closeSocket = (socket: WebSocket) => {
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      socket.close()
      socketRef.current = null
    }
  }

  const scheduleReconnectionAttempt = () => {
    if (
      shouldReconnectRef.current &&
      reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
    ) {
      const delay = calculateReconnectDelay(
        reconnectAttemptsRef.current,
        INITIAL_RECONNECT_DELAY,
        MAX_RECONNECT_DELAY,
      )
      reconnectAttemptsRef.current += 1

      reconnectTimeoutRef.current = setTimeout(() => {
        connectRef.current?.()
      }, delay)
    } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      shouldReconnectRef.current = false
    }
  }

  const handleOpen = useCallback(() => {
    reconnectAttemptsRef.current = 0
    setIsConnected(true)
    setIsConnecting(false)
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const handleMessage = useCallback((event: MessageEvent) => {
    onMessageRef.current(event)
  }, [])

  const handleError = useCallback(() => {
    setIsConnected(false)
    setIsConnecting(false)
  }, [])

  const handleClose = useCallback(() => {
    setIsConnected(false)
    setIsConnecting(false)
    socketRef.current = null
    resetWebSocketInstance()
    scheduleReconnectionAttempt()
  }, [])

  const connect = useCallback(() => {
    if (typeof window === 'undefined' || !shouldReconnectRef.current) {
      return
    }
    const url = getServerUrl()
    const socket = createWebSocket(url)
    if (!socket) {
      setIsConnecting(false)
      return
    }
    setIsConnecting(true)
    socketRef.current = socket
    socket.onopen = handleOpen
    socket.onmessage = handleMessage
    socket.onerror = handleError
    socket.onclose = handleClose
  }, [handleOpen, handleMessage, handleError, handleClose])

  useEffect(() => {
    connectRef.current = connect
  }, [connect])

  useEffect(() => {
    shouldReconnectRef.current = true

    const initializeConnection = () => {
      if (typeof window === 'undefined' || !shouldReconnectRef.current) {
        return
      }

      const url = getServerUrl()
      const socket = createWebSocket(url)

      if (!socket) {
        setIsConnecting(false)
        return
      }

      setIsConnecting(true)
      socketRef.current = socket
      socket.onopen = handleOpen
      socket.onmessage = handleMessage
      socket.onerror = handleError
      socket.onclose = handleClose
    }

    initializeConnection()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      if (socketRef.current) {
        closeSocket(socketRef.current)
      }
    }
  }, [handleOpen, handleMessage, handleError, handleClose])

  const sendMessage = useCallback((message: string): boolean => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message)
      return true
    }
    return false
  }, [])

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      closeSocket(socketRef.current)
    }
    reconnectAttemptsRef.current = 0
    shouldReconnectRef.current = true
    connectRef.current?.()
  }, [])

  return {
    sendMessage,
    isConnected,
    isConnecting,
    reconnect,
  }
}
