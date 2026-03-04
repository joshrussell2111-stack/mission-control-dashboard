import { useMemo } from 'react'

// Sparkline component for trend visualization
function Sparkline({ data, color = '#00D4FF', height = 30, width = 80 }) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return ''
    
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - min) / range) * height
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }, [data, height, width])

  return (
    <svg width={width} height={height} className="sparkline">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data && data.length > 0 && (
        <>
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * height}
            r="3"
            fill={color}
          />
        </>
      )}
    </svg>
  )
}

export function MetricCard({ 
  title, 
  value, 
  unit = '', 
  trend = null, 
  trendLabel = '',
  sparklineData = null,
  sparklineColor = '#00D4FF',
  icon = null,
  variant = 'default'
}) {
  const trendPositive = trend !== null && trend >= 0
  const trendNegative = trend !== null && trend < 0
  
  const variants = {
    default: '',
    success: 'metric-success',
    warning: 'metric-warning',
    danger: 'metric-danger',
    gold: 'metric-gold',
  }

  return (
    <div className={`metric-card glass-card ${variants[variant] || ''}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {icon && <span className="metric-icon">{icon}</span>}
      </div>
      
      <div className="metric-body">
        <div className="metric-value-wrapper">
          <span className="metric-value">{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        
        {sparklineData && (
          <div className="metric-sparkline">
            <Sparkline data={sparklineData} color={sparklineColor} />
          </div>
        )}
      </div>
      
      {trend !== null && (
        <div className="metric-footer">
          <span className={`metric-trend ${trendPositive ? 'positive' : ''} ${trendNegative ? 'negative' : ''}`}>
            {trendPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="metric-trend-label">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}

// KPI Grid component for 3-column metric layout
export function KPIGrid({ children }) {
  return (
    <div className="kpi-grid">
      {children}
    </div>
  )
}
