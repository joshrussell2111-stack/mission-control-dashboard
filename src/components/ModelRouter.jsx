import { useEffect, useState } from 'react'
import { useModelStore } from '../stores/dashboardStore.js'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import './ModelRouter.css'

// Icons
const Icons = {
  Route: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  ),
  Zap: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  DollarSign: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

// Routing rules configuration
const routingRules = [
  {
    id: 'default',
    name: 'Default Route',
    condition: 'All requests',
    target: 'kimi',
    priority: 1,
    enabled: true,
  },
  {
    id: 'image',
    name: 'Image Analysis',
    condition: 'Contains image input',
    target: 'claude',
    priority: 2,
    enabled: true,
  },
  {
    id: 'fallback',
    name: 'Fallback',
    condition: 'Primary unavailable',
    target: 'openrouter',
    priority: 99,
    enabled: true,
  },
]

// Cost per 1K tokens (example pricing)
const costRates = {
  kimi: { input: 0.003, output: 0.006 },
  claude: { input: 0.008, output: 0.024 },
  openrouter: { input: 0.005, output: 0.015 },
}

export default function ModelRouter() {
  const models = useModelStore((state) => state.models)
  const currentModel = useModelStore((state) => state.currentModel)
  const [selectedRule, setSelectedRule] = useState(null)
  const [showCosts, setShowCosts] = useState(true)

  // Calculate costs for each model
  const modelStats = Object.entries(models).map(([id, model]) => {
    const inputCost = (model.tokensIn / 1000) * costRates[id].input
    const outputCost = (model.tokensOut / 1000) * costRates[id].output
    const totalCost = inputCost + outputCost
    const avgLatency = model.latency || 0
    const successRate = model.tokensIn > 0 ? 99.5 : 100

    return {
      id,
      ...model,
      inputCost,
      outputCost,
      totalCost,
      avgLatency,
      successRate,
    }
  })

  const totalSpend = modelStats.reduce((sum, m) => sum + m.totalCost, 0)

  // Auto-update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate routing decisions
      const randomModel = Object.keys(models)[Math.floor(Math.random() * 3)]
      useModelStore.getState().updateLatency(randomModel, Math.floor(Math.random() * 100) + 20)
    }, 5000)
    return () => clearInterval(interval)
  }, [models])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--accent-green)'
      case 'standby': return 'var(--accent-gold)'
      case 'offline': return 'var(--text-muted)'
      case 'error': return 'var(--accent-red)'
      default: return 'var(--text-muted)'
    }
  }

  const getTargetName = (targetId) => {
    return models[targetId]?.name || targetId
  }

  return (
    <div className="model-router">
      <WidgetHeader 
        title="Model Router" 
        badge={currentModel.toUpperCase()}
        badgeClass="default"
      />

      <div className="router-content">
        {/* Routing Flow Visualization */}
        <div className="routing-flow">
          <div className="flow-header">
            <Icons.Route />
            <span>Active Routing Logic</span>
          </div>
          
          <div className="rules-list">
            {routingRules.map((rule, index) => (
              <div 
                key={rule.id}
                className={`rule-item ${rule.enabled ? 'enabled' : 'disabled'} ${selectedRule === rule.id ? 'selected' : ''}`}
                onClick={() => setSelectedRule(rule.id === selectedRule ? null : rule.id)}
              >
                <div className="rule-priority">{rule.priority}</div>
                <div className="rule-content">
                  <div className="rule-name">{rule.name}</div>
                  <div className="rule-condition">{rule.condition}</div>
                </div>
                <div className="rule-arrow">→</div>
                <div 
                  className="rule-target"
                  style={{ color: getStatusColor(models[rule.target]?.status) }}
                >
                  {getTargetName(rule.target)}
                </div>
                <div className={`rule-status ${rule.enabled ? 'active' : 'inactive'}`}>
                  {rule.enabled ? 'ON' : 'OFF'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance Metrics */}
        <div className="performance-section">
          <div className="section-header">
            <div className="section-title">
              <Icons.Zap />
              <span>Performance Metrics</span>
            </div>
            <button 
              className="toggle-btn"
              onClick={() => setShowCosts(!showCosts)}
            >
              {showCosts ? 'Show Latency' : 'Show Costs'}
            </button>
          </div>

          <div className="metrics-grid">
            {modelStats.map((model) => (
              <div 
                key={model.id} 
                className={`metric-card ${currentModel === model.id ? 'current' : ''}`}
              >
                <div className="metric-header">
                  <span className="metric-name">{model.name}</span>
                  <span 
                    className="metric-status"
                    style={{ color: getStatusColor(model.status) }}
                  >
                    {model.status}
                  </span>
                </div>

                <div className="metric-values">
                  {showCosts ? (
                    <>
                      <div className="metric-value cost">
                        <Icons.DollarSign />
                        <span className="value">${model.totalCost.toFixed(3)}</span>
                        <span className="label">total</span>
                      </div>
                      <div className="metric-breakdown">
                        <span>In: ${model.inputCost.toFixed(3)}</span>
                        <span>Out: ${model.outputCost.toFixed(3)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="metric-value latency">
                        <Icons.Clock />
                        <span className="value">{model.avgLatency}ms</span>
                        <span className="label">avg</span>
                      </div>
                      <div className="metric-breakdown">
                        <span>Success: {model.successRate}%</span>
                        <span>Tokens: {(model.tokensIn + model.tokensOut).toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ 
                      width: `${Math.min((model.tokensIn + model.tokensOut) / 10000 * 100, 100)}%`,
                      background: getStatusColor(model.status)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="cost-summary">
          <div className="cost-header">
            <Icons.DollarSign />
            <span>Session Cost Summary</span>
          </div>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span className="cost-label">Total Spend</span>
              <span className="cost-value total">${totalSpend.toFixed(4)}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Est. per 1K requests</span>
              <span className="cost-value">${(totalSpend * 10).toFixed(4)}</span>
            </div>
            <div className="cost-item">
              <span className="cost-label">Most efficient</span>
              <span className="cost-value">
                {modelStats.sort((a, b) => a.totalCost - b.totalCost)[0]?.name || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
