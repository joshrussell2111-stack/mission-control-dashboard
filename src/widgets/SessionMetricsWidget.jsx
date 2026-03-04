import { useQuery } from '@tanstack/react-query'
import { useSessionStore } from '../stores/dashboardStore.js'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import { SparklineChart } from '../components/SparklineChart.jsx'
import './SessionMetricsWidget.css'

async function fetchSessionMetrics() {
  // In production, this would be a real API call
  // const response = await fetch('/api/sessions/metrics')
  // return response.json()
  
  // Simulated data for now
  return {
    activeSessions: Math.floor(Math.random() * 20) + 5,
    totalRequests: 1247 + Math.floor(Math.random() * 100),
    avgResponseTime: 89 + Math.floor(Math.random() * 20),
    tokensIn: 456000 + Math.floor(Math.random() * 10000),
    tokensOut: 189000 + Math.floor(Math.random() * 5000),
    costEstimate: 2.45 + Math.random() * 0.5,
  }
}

export default function SessionMetricsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['sessionMetrics'],
    queryFn: fetchSessionMetrics,
    refetchInterval: 30000,
  })
  
  const tokenHistory = useSessionStore((state) => state.tokenHistory)

  // Add data point when new data arrives
  if (data) {
    useSessionStore.getState().addMetricPoint({
      tokensIn: data.tokensIn,
      tokensOut: data.tokensOut,
    })
  }

  const sparklineData = tokenHistory.map((point) => 
    (point.tokensIn + point.tokensOut) / 1000
  ).slice(-20)

  if (isLoading) {
    return (
      <div className="session-metrics-widget loading">
        <WidgetHeader title="Session Metrics" badge="24h" />
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="session-metrics-widget">
      <WidgetHeader title="Session Metrics" badge="24h" />
      
      <div className="metrics-content">
        <div className="metric-large">
          <span className="metric-number">{data?.activeSessions || 0}</span>
          <span className="metric-unit">Active Sessions</span>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-value">
              {data?.totalRequests?.toLocaleString() || 0}
            </span>
            <span className="metric-label">Requests</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-value">
              {data?.avgResponseTime || 0}ms
            </span>
            <span className="metric-label">Avg Response</span>
          </div>
        </div>
        
        <div className="token-metrics">
          <div className="token-item">
            <span className="token-label">Tokens In</span>
            <span className="token-value">
              {(data?.tokensIn / 1000).toFixed(1)}k
            </span>
          </div>
          
          <div className="token-item">
            <span className="token-label">Tokens Out</span>
            <span className="token-value">
              {(data?.tokensOut / 1000).toFixed(1)}k
            </span>
          </div>
          
          <div className="token-item cost">
            <span className="token-label">Est. Cost</span>
            <span className="token-value gold">
              ${data?.costEstimate?.toFixed(2)}
            </span>
          </div>
        </div>
        
        {sparklineData.length > 1 && (
          <div className="sparkline-container">
            <span className="sparkline-label">Token Usage Trend</span>
            <SparklineChart data={sparklineData} color="var(--accent-cyan)" />
          </div>
        )}
      </div>
    </div>
  )
}
