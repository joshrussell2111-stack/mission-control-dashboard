import { useState, useEffect } from 'react'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import './ResourcesWidget.css'

export default function ResourcesWidget() {
  const [resources, setResources] = useState({
    cpu: { value: 34, unit: '%' },
    memory: { value: 2.4, unit: 'GB', percent: 62 },
    disk: { value: 45, unit: '%' },
    network: { value: 12, unit: 'MB/s', percent: 23 },
  })

  // Simulate resource updates
  useEffect(() => {
    const interval = setInterval(() => {
      setResources((prev) => ({
        cpu: { ...prev.cpu, value: Math.max(5, Math.min(95, prev.cpu.value + (Math.random() - 0.5) * 10)) },
        memory: { 
          ...prev.memory, 
          value: Math.max(1, Math.min(8, prev.memory.value + (Math.random() - 0.5) * 0.2)),
          percent: Math.max(10, Math.min(90, prev.memory.percent + Math.floor((Math.random() - 0.5) * 5))),
        },
        disk: { ...prev.disk, value: Math.max(20, Math.min(90, prev.disk.value + (Math.random() - 0.5) * 2)) },
        network: { 
          ...prev.network, 
          value: Math.max(0, prev.network.value + (Math.random() - 0.5) * 4),
          percent: Math.max(5, Math.min(80, prev.network.percent + Math.floor((Math.random() - 0.5) * 10))),
        },
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getBarColor = (percent) => {
    if (percent < 50) return 'var(--accent-cyan)'
    if (percent < 80) return 'var(--accent-gold)'
    return 'var(--accent-red)'
  }

  return (
    <div className="resources-widget">
      <WidgetHeader title="Resource Metrics">
        <span className="resource-badge">
          <span className="pulse-dot"></span>
          Healthy
        </span>
      </WidgetHeader>
      
      <div className="resource-grid">
        {Object.entries(resources).map(([name, data]) => (
          <div key={name} className="resource-item">
            <div className="resource-header">
              <span className="resource-name">{name.toUpperCase()}</span>
              <span className="resource-value" style={{ color: getBarColor(data.percent || data.value) }}>
                {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}{data.unit}
              </span>
            </div>
            <div className="resource-bar">
              <div 
                className="resource-fill"
                style={{ 
                  width: `${data.percent || data.value}%`,
                  background: getBarColor(data.percent || data.value),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
