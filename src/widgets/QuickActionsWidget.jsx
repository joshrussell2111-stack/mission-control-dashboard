import { useState } from 'react'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import './QuickActionsWidget.css'

export default function QuickActionsWidget() {
  const [loading, setLoading] = useState(null)
  const [results, setResults] = useState({})

  const actions = [
    { id: 'restart', label: 'Restart Gateway', icon: '↻', primary: true },
    { id: 'config', label: 'Load Config', icon: '⚙' },
    { id: 'usage', label: 'Usage Report', icon: '📊' },
    { id: 'logs', label: 'View Logs', icon: '📋' },
    { id: 'cron', label: 'Cron Jobs', icon: '⏰' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
  ]

  const handleAction = async (actionId) => {
    setLoading(actionId)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setResults((prev) => ({
      ...prev,
      [actionId]: `Action ${actionId} completed at ${new Date().toLocaleTimeString()}`,
    }))
    
    setLoading(null)
  }

  return (
    <div className="quick-actions-widget">
      <WidgetHeader title="Quick Actions" />
      
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`action-btn ${action.primary ? 'primary' : ''} ${loading === action.id ? 'loading' : ''}`}
            onClick={() => handleAction(action.id)}
            disabled={loading !== null}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
            {loading === action.id && <span className="action-spinner"></span>}
          </button>
        ))}
      </div>
    </div>
  )
}
