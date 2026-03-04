import { useEffect } from 'react'
import { useModelStore } from '../stores/dashboardStore.js'
import { useWebSocket } from '../hooks/useWebSocket.js'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import './ModelStatusWidget.css'

export default function ModelStatusWidget() {
  const models = useModelStore((state) => state.models)
  const currentModel = useModelStore((state) => state.currentModel)
  const { isConnected } = useWebSocket()

  // Simulate real-time updates (in production, this comes from WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      // Update latencies with small variations
      Object.keys(models).forEach((modelId) => {
        const model = models[modelId]
        if (model.status === 'active' && model.latency) {
          const variation = (Math.random() - 0.5) * 10
          const newLatency = Math.max(10, Math.round(model.latency + variation))
          useModelStore.getState().updateLatency(modelId, newLatency)
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [models])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--accent-cyan)'
      case 'standby': return 'var(--accent-gold)'
      case 'offline': return 'var(--text-muted)'
      case 'error': return 'var(--accent-red)'
      default: return 'var(--text-muted)'
    }
  }

  const getStatusIcon = (modelId) => {
    switch (modelId) {
      case 'kimi': return 'K'
      case 'claude': return 'C'
      case 'openrouter': return 'OR'
      default: return '?'
    }
  }

  return (
    <div className="model-status-widget">
      <WidgetHeader 
        title="Model Routing" 
        badge={isConnected ? 'LIVE' : 'OFFLINE'}
        badgeClass={isConnected ? 'live' : 'offline'}
      />
      
      <div className="model-status-grid">
        {Object.entries(models).map(([modelId, model]) => (
          <div 
            key={modelId}
            className={`model-item ${currentModel === modelId ? 'current' : ''}`}
          >
            <div 
              className="model-icon"
              style={{ 
                background: getStatusColor(model.status),
                opacity: model.status === 'offline' ? 0.5 : 1 
              }}
            >
              {getStatusIcon(modelId)}
            </div>
            
            <div className="model-info">
              <span className="model-name">{model.name}</span>
              <span 
                className="model-status"
                style={{ color: getStatusColor(model.status) }}
              >
                {model.status}
                {currentModel === modelId && (
                  <span className="current-indicator">
                    <span className="pulse-dot active"></span>
                  </span>
                )}
              </span>
            </div>
            
            <div className="model-metrics">
              <span className="metric-value">
                {model.latency ? `${model.latency}ms` : '--'}
              </span>
              <span className="metric-label">latency</span>
              {model.tokensIn > 0 && (
                <span className="token-count">
                  {(model.tokensIn / 1000).toFixed(1)}k tokens
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isConnected && (
        <div className="connection-indicator">
          <span className="pulse-dot active"></span>
          <span>Real-time updates active</span>
        </div>
      )}
    </div>
  )
}
