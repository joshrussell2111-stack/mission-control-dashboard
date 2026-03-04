import { useDashboardStore } from '../stores/dashboardStore.js'

export function Header() {
  const isEditMode = useDashboardStore((state) => state.isEditMode)
  const toggleEditMode = useDashboardStore((state) => state.toggleEditMode)
  const resetLayout = useDashboardStore((state) => state.resetLayout)
  const wsConnected = useDashboardStore((state) => state.wsConnected)
  const sseConnected = useDashboardStore((state) => state.sseConnected)
  const sidebarCollapsed = useDashboardStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar)

  return (
    <>
      {/* Mobile menu toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <header className="mission-header">
        <div className="header-left">
          <div className="mission-logo">🔥</div>
          <div className="header-title">
            <h1>Mission Control</h1>
            <span className="header-subtitle">OpenClaw Orchestration Dashboard</span>
          </div>
        </div>
      
      <div className="header-center">
        <div className="header-controls">
          <button 
            className={`control-btn ${isEditMode ? 'active' : ''}`}
            onClick={toggleEditMode}
            title={isEditMode ? 'Done editing' : 'Edit layout'}
          >
            {isEditMode ? 'Done' : 'Edit Layout'}
          </button>
          {isEditMode && (
            <button 
              className="control-btn secondary"
              onClick={resetLayout}
              title="Reset to default"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      
      <div className="header-right">
        <div className="telemetry-badges">
          <div className={`telemetry-badge ${wsConnected ? 'online' : 'offline'}`}>
            <span className={`telemetry-dot ${wsConnected ? 'status-online' : 'status-offline'}`}></span>
            <span className="telemetry-label">WS {wsConnected ? 'ON' : 'OFF'}</span>
          </div>
          <div className={`telemetry-badge ${sseConnected ? 'online' : 'offline'}`}>
            <span className={`telemetry-dot ${sseConnected ? 'status-online' : 'status-offline'}`}></span>
            <span className="telemetry-label">SSE {sseConnected ? 'ON' : 'OFF'}</span>
          </div>
        </div>
        <div className="time-display" id="utc-time">--:--:-- UTC</div>
      </div>
    </header>
    </>
  )
}
