import { useDashboardStore } from '../stores/dashboardStore.js'

export function LiveModeToggle() {
  const isLive = useDashboardStore((state) => state.isLiveMode)
  const toggleLive = useDashboardStore((state) => state.toggleLiveMode)

  return (
    <button 
      className={`live-mode-toggle ${isLive ? 'active' : ''}`}
      onClick={toggleLive}
      title={isLive ? 'Live mode enabled' : 'Live mode disabled'}
    >
      <span className="live-indicator">
        <span className="live-dot"></span>
        <span className="live-pulse"></span>
      </span>
      <span className="live-label">LIVE</span>
    </button>
  )
}
