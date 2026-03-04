import { useState, useEffect } from 'react'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import './TokenUsageWidget.css'

export default function TokenUsageWidget() {
  const [usage, setUsage] = useState({
    used: 750000,
    total: 1000000,
  })
  
  const percentage = Math.round((usage.used / usage.total) * 100)
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Simulate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUsage((prev) => ({
        ...prev,
        used: Math.min(prev.used + Math.floor(Math.random() * 100), prev.total),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getColor = () => {
    if (percentage < 50) return 'var(--accent-cyan)'
    if (percentage < 80) return 'var(--accent-gold)'
    return 'var(--accent-red)'
  }

  return (
    <div className="token-usage-widget">
      <WidgetHeader title="Token Usage" badge="MTD" />
      
      <div className="token-display">
        <div className="token-ring">
          <svg viewBox="0 0 100 100">
            <circle className="ring-bg" cx="50" cy="50" r="40"/>
            <circle 
              className="ring-progress" 
              cx="50" 
              cy="50" 
              r="40"
              stroke={getColor()}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="ring-center">
            <span className="token-percent" style={{ color: getColor() }}>
              {percentage}%
            </span>
          </div>
        </div>
        
        <div className="token-details">
          <div className="token-metric">
            <span className="token-value">{(usage.used / 1000).toFixed(0)}K</span>
            <span className="token-label">Used</span>
          </div>
          <div className="token-metric">
            <span className="token-value">{((usage.total - usage.used) / 1000).toFixed(0)}K</span>
            <span className="token-label">Remaining</span>
          </div>
        </div>
      </div>
    </div>
  )
}
