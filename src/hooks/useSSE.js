import { useEffect, useRef, useCallback } from 'react'
import { useDashboardStore, useSessionStore } from '../stores/dashboardStore'

const SSE_URL = `/api/events`
const RECONNECT_DELAY = 5000

export function useSSE() {
  const eventSource = useRef(null)
  const reconnectTimer = useRef(null)
  
  const setSseConnected = useDashboardStore((state) => state.setSseConnected)
  const setLastUpdate = useDashboardStore((state) => state.setLastUpdate)
  const updateSessionStats = useSessionStore((state) => state.updateSessionStats)
  const addMetricPoint = useSessionStore((state) => state.addMetricPoint)

  const connect = useCallback(() => {
    if (eventSource.current?.readyState === EventSource.OPEN) return

    try {
      eventSource.current = new EventSource(SSE_URL)

      eventSource.current.onopen = () => {
        console.log('SSE connected')
        setSseConnected(true)
      }

      eventSource.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleEvent(data)
          setLastUpdate()
        } catch (err) {
          console.error('Failed to parse SSE message:', err)
        }
      }

      eventSource.current.onerror = () => {
        console.log('SSE error/disconnect')
        setSseConnected(false)
        eventSource.current?.close()
        
        // Auto-reconnect
        reconnectTimer.current = setTimeout(() => {
          connect()
        }, RECONNECT_DELAY)
      }
    } catch (err) {
      console.error('Failed to create EventSource:', err)
    }
  }, [])

  const handleEvent = useCallback((data) => {
    switch (data.type) {
      case 'session.stats':
        updateSessionStats({
          activeSessions: data.activeSessions,
          totalRequests: data.totalRequests,
          avgResponseTime: data.avgResponseTime,
        })
        break
      case 'metrics.tokens':
        addMetricPoint({
          tokensIn: data.tokensIn,
          tokensOut: data.tokensOut,
          cost: data.cost,
        })
        break
      case 'heartbeat':
        // Keep connection alive
        break
      default:
        console.log('Unknown SSE event type:', data.type)
    }
  }, [updateSessionStats, addMetricPoint])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
      if (eventSource.current) {
        eventSource.current.close()
      }
    }
  }, [connect])

  return { isConnected: useDashboardStore((state) => state.sseConnected) }
}
