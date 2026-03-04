import { useEffect, useRef, useCallback } from 'react'
import { useDashboardStore, useModelStore } from '../stores/dashboardStore'

const WS_URL = `ws://${window.location.host}/ws`
const RECONNECT_DELAY = 3000
const MAX_RECONNECT_ATTEMPTS = 5

export function useWebSocket() {
  const ws = useRef(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimer = useRef(null)
  
  const setWsConnected = useDashboardStore((state) => state.setWsConnected)
  const updateModel = useModelStore((state) => state.updateModel)
  const setCurrentModel = useModelStore((state) => state.setCurrentModel)
  const updateLatency = useModelStore((state) => state.updateLatency)
  const addTokens = useModelStore((state) => state.addTokens)

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    try {
      ws.current = new WebSocket(WS_URL)

      ws.current.onopen = () => {
        console.log('WebSocket connected')
        setWsConnected(true)
        reconnectAttempts.current = 0
        
        // Subscribe to model updates
        ws.current.send(JSON.stringify({ type: 'subscribe', channel: 'models' }))
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleMessage(data)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.current.onclose = () => {
        console.log('WebSocket disconnected')
        setWsConnected(false)
        attemptReconnect()
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      attemptReconnect()
    }
  }, [])

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'model.status':
        updateModel(data.modelId, { status: data.status })
        break
      case 'model.latency':
        updateLatency(data.modelId, data.latency)
        break
      case 'model.tokens':
        addTokens(data.modelId, data.input, data.output)
        break
      case 'model.switch':
        setCurrentModel(data.modelId)
        break
      case 'ping':
        ws.current?.send(JSON.stringify({ type: 'pong' }))
        break
      default:
        console.log('Unknown message type:', data.type)
    }
  }, [updateModel, updateLatency, addTokens, setCurrentModel])

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached')
      return
    }

    reconnectAttempts.current++
    console.log(`Reconnecting... attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS}`)

    reconnectTimer.current = setTimeout(() => {
      connect()
    }, RECONNECT_DELAY * reconnectAttempts.current)
  }, [connect])

  const send = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
      return true
    }
    return false
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  return { send, isConnected: useDashboardStore((state) => state.wsConnected) }
}
