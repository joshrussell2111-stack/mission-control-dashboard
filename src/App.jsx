import { useEffect, useState, useRef } from 'react'
import { Responsive } from 'react-grid-layout'
import { useDashboardStore, useModelStore, useSessionStore, useSubagentStore } from './stores/dashboardStore.js'
import { useWebSocket } from './hooks/useWebSocket.js'
import { useSSE } from './hooks/useSSE.js'
import { getWidgetComponent } from './lib/widgetRegistry.jsx'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { CommandPalette } from './components/CommandPalette.jsx'
import { DataTable } from './components/DataTable.jsx'
import { ActivityHeatmap } from './components/ActivityHeatmap.jsx'
import { MetricCard, KPIGrid } from './components/MetricCard.jsx'
import { Breadcrumbs } from './components/Breadcrumbs.jsx'
import { LiveModeToggle } from './components/LiveModeToggle.jsx'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

// ===== MOCK DATA =====

// Sample request logs for DataTable
const sampleRequestLogs = [
  { id: 1, timestamp: '2026-03-04 18:12:45', model: 'Kimi K2.5', status: 'success', duration: '1.2s', tokens: '2.4k', request: 'Generate market analysis report' },
  { id: 2, timestamp: '2026-03-04 18:11:32', model: 'Claude 3.5', status: 'success', duration: '2.1s', tokens: '3.1k', request: 'Image analysis: portfolio chart' },
  { id: 3, timestamp: '2026-03-04 18:10:18', model: 'OpenRouter', status: 'error', duration: '5.0s', tokens: '0', request: 'Fetch real-time market data' },
  { id: 4, timestamp: '2026-03-04 18:09:55', model: 'Kimi K2.5', status: 'success', duration: '0.8s', tokens: '1.2k', request: 'Summarize earnings call' },
  { id: 5, timestamp: '2026-03-04 18:08:42', model: 'Kimi K2.5', status: 'success', duration: '1.5s', tokens: '2.8k', request: 'Generate client proposal' },
  { id: 6, timestamp: '2026-03-04 18:07:21', model: 'Claude 3.5', status: 'warning', duration: '3.2s', tokens: '4.5k', request: 'Complex financial modeling' },
  { id: 7, timestamp: '2026-03-04 18:06:10', model: 'Kimi K2.5', status: 'success', duration: '0.9s', tokens: '1.8k', request: 'Email draft: quarterly update' },
  { id: 8, timestamp: '2026-03-04 18:05:33', model: 'OpenRouter', status: 'success', duration: '1.8s', tokens: '2.2k', request: 'Cross-reference SEC filings' },
  { id: 9, timestamp: '2026-03-04 18:04:19', model: 'Kimi K2.5', status: 'success', duration: '1.1s', tokens: '2.0k', request: 'Risk assessment analysis' },
  { id: 10, timestamp: '2026-03-04 18:03:47', model: 'Kimi K2.5', status: 'success', duration: '0.7s', tokens: '0.9k', request: 'Quick market summary' },
  { id: 11, timestamp: '2026-03-04 18:02:15', model: 'Claude 3.5', status: 'success', duration: '2.5s', tokens: '3.8k', request: 'Document comparison' },
  { id: 12, timestamp: '2026-03-04 18:01:02', model: 'Kimi K2.5', status: 'error', duration: '0.5s', tokens: '0', request: 'Connect to database' },
  { id: 13, timestamp: '2026-03-04 17:58:33', model: 'Kimi K2.5', status: 'success', duration: '1.3s', tokens: '2.1k', request: 'Portfolio rebalancing suggestions' },
  { id: 14, timestamp: '2026-03-04 17:55:12', model: 'OpenRouter', status: 'success', duration: '2.8s', tokens: '3.5k', request: 'Multi-model consensus analysis' },
  { id: 15, timestamp: '2026-03-04 17:52:45', model: 'Claude 3.5', status: 'success', duration: '1.9s', tokens: '2.7k', request: 'Tax optimization strategies' },
]

// Table column definitions
const tableColumns = [
  { key: 'timestamp', title: 'Timestamp', sortable: true, width: '140px' },
  { key: 'model', title: 'Model', sortable: true, filterable: true, width: '120px' },
  { key: 'status', title: 'Status', sortable: true, filterable: true, width: '100px', render: (value) => (
    <span className={`status-badge ${value}`}>{value}</span>
  )},
  { key: 'duration', title: 'Duration', sortable: true, width: '80px' },
  { key: 'tokens', title: 'Tokens', sortable: true, width: '80px' },
  { key: 'request', title: 'Request', sortable: true },
]

// Generate sparkline data
const generateSparklineData = (points = 20) => {
  return Array.from({ length: points }, (_, i) => 
    Math.floor(Math.random() * 50) + 50 + i * 2
  )
}

function App() {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(1200)
  const [showLogs, setShowLogs] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  
  // Store selectors
  const layout = useDashboardStore((state) => state.layout)
  const visibleWidgets = useDashboardStore((state) => state.visibleWidgets)
  const isEditMode = useDashboardStore((state) => state.isEditMode)
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed)
  const isLiveMode = useDashboardStore((state) => state.isLiveMode)
  const setLayout = useDashboardStore((state) => state.setLayout)
  const openCommandPalette = useDashboardStore((state) => state.openCommandPalette)
  const setBreadcrumbs = useDashboardStore((state) => state.setBreadcrumbs)
  
  // Subagent store for activity data
  const addActivityPoint = useSubagentStore((state) => state.addActivityPoint)
  const recordTaskCompletion = useSubagentStore((state) => state.recordTaskCompletion)
  
  // Initialize real-time connections
  useWebSocket()
  useSSE()

  // Set initial breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Mission Control', path: '/' },
      { label: 'Dashboard', path: '/dashboard' },
    ])
  }, [setBreadcrumbs])

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth)
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [sidebarCollapsed])

  // Update time display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeEl = document.getElementById('utc-time')
      if (timeEl) {
        timeEl.textContent = now.toISOString().split('T')[1].split('.')[0] + ' UTC'
      }
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate live activity data for heatmap
  useEffect(() => {
    if (!isLiveMode) return
    
    const interval = setInterval(() => {
      const subagents = ['scout', 'pixel', 'sage', 'muse']
      const randomAgent = subagents[Math.floor(Math.random() * subagents.length)]
      
      if (Math.random() > 0.7) {
        addActivityPoint(randomAgent, Math.floor(Math.random() * 3) + 1)
        if (Math.random() > 0.8) {
          recordTaskCompletion(randomAgent, Math.random() > 0.1)
        }
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isLiveMode, addActivityPoint, recordTaskCompletion])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
      }
      // Logs: Cmd/Ctrl + L
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault()
        setShowLogs(prev => !prev)
      }
      // Heatmap: Cmd/Ctrl + H
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault()
        setShowHeatmap(prev => !prev)
      }
      // Metrics: Cmd/Ctrl + M
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault()
        setShowMetrics(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openCommandPalette])

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout)
  }

  const generateLayouts = () => {
    const layouts = {}
    Object.keys(breakpoints).forEach((bp) => {
      layouts[bp] = layout.filter((item) => visibleWidgets.includes(item.i))
    })
    return layouts
  }

  // Row action handlers
  const handleViewDetails = (row) => {
    console.log('View details:', row)
    alert(`Request Details:\n\nModel: ${row.model}\nStatus: ${row.status}\nRequest: ${row.request}`)
  }

  const handleRetry = (row) => {
    console.log('Retry:', row)
    alert(`Retrying request: ${row.request}`)
  }

  const handleCopy = (row) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2))
    console.log('Copied to clipboard:', row)
  }

  const rowActions = [
    { label: 'View Details', icon: '👁', onClick: handleViewDetails },
    { label: 'Retry', icon: '🔄', onClick: handleRetry },
    { label: 'Copy', icon: '📋', onClick: handleCopy },
  ]

  // Metric card data
  const metricData = [
    { title: 'Active Sessions', value: '12', unit: '', trend: 8, trendLabel: 'vs last hour', sparklineData: generateSparklineData(), variant: 'default' },
    { title: 'Avg Response', value: '145', unit: 'ms', trend: -12, trendLabel: 'vs last hour', sparklineData: generateSparklineData(), variant: 'success' },
    { title: 'Success Rate', value: '98.5', unit: '%', trend: 2.1, trendLabel: 'vs yesterday', sparklineData: generateSparklineData(), variant: 'success' },
    { title: 'Token Usage', value: '2.4', unit: 'M', trend: 15, trendLabel: 'MTD', sparklineData: generateSparklineData(), variant: 'warning' },
    { title: 'Est. Cost', value: '$12.45', unit: '', trend: -5, trendLabel: 'vs last week', sparklineData: generateSparklineData(), variant: 'gold' },
    { title: 'Error Rate', value: '1.2', unit: '%', trend: -0.3, trendLabel: 'improving', sparklineData: generateSparklineData(), variant: 'danger' },
  ]

  return (
    <>
      <Sidebar />
      <div className={`app with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        
        {/* Sub-header with breadcrumbs and controls */}
        <div className="sub-header">
          <Breadcrumbs />
          <div className="sub-header-controls">
            <LiveModeToggle />
            <button 
              className="header-action-btn"
              onClick={() => setShowMetrics(true)}
              title="View Metrics (⌘M)"
            >
              <span>📊</span> Metrics
            </button>
            <button 
              className="header-action-btn"
              onClick={() => setShowHeatmap(true)}
              title="View Heatmap (⌘H)"
            >
              <span>🔥</span> Heatmap
            </button>
            <button 
              className="header-action-btn"
              onClick={() => setShowLogs(true)}
              title="View Logs (⌘L)"
            >
              <span>📋</span> Logs
            </button>
          </div>
        </div>
        
        <main className="dashboard" ref={containerRef}>
          {/* Command Palette */}
          <CommandPalette />
          
          {/* Metrics Modal */}
          {showMetrics && (
            <div className="modal-overlay" onClick={() => setShowMetrics(false)}>
              <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Key Performance Indicators</h2>
                  <button className="modal-close" onClick={() => setShowMetrics(false)}>×</button>
                </div>
                <div className="modal-body">
                  <KPIGrid>
                    {metricData.map((metric, idx) => (
                      <MetricCard
                        key={idx}
                        title={metric.title}
                        value={metric.value}
                        unit={metric.unit}
                        trend={metric.trend}
                        trendLabel={metric.trendLabel}
                        sparklineData={metric.sparklineData}
                        variant={metric.variant}
                      />
                    ))}
                  </KPIGrid>
                </div>
              </div>
            </div>
          )}
          
          {/* Activity Heatmap Modal */}
          {showHeatmap && (
            <div className="modal-overlay" onClick={() => setShowHeatmap(false)}>
              <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Subagent Activity Heatmap</h2>
                  <button className="modal-close" onClick={() => setShowHeatmap(false)}>×</button>
                </div>
                <div className="modal-body">
                  <ActivityHeatmap />
                </div>
              </div>
            </div>
          )}
          
          {/* Request Logs Modal */}
          {showLogs && (
            <div className="modal-overlay" onClick={() => setShowLogs(false)}>
              <div className="modal-content xlarge" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Request Logs</h2>
                  <button className="modal-close" onClick={() => setShowLogs(false)}>×</button>
                </div>
                <div className="modal-body">
                  <DataTable 
                    columns={tableColumns}
                    data={sampleRequestLogs}
                    rowActions={rowActions}
                    pageSize={8}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Main Grid Layout */}
          <Responsive
            className="layout"
            layouts={generateLayouts()}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={60}
            width={width}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            onLayoutChange={handleLayoutChange}
            margin={[16, 16]}
            containerPadding={[16, 16]}
          >
            {visibleWidgets.map((widgetId) => (
              <div key={widgetId} className="widget-wrapper glass-card">
                {getWidgetComponent(widgetId)}
              </div>
            ))}
          </Responsive>
        </main>
        
        <Footer />
      </div>
    </>
  )
}

export default App
