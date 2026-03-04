import { useDashboardStore } from '../stores/dashboardStore.js'

export function Footer() {
  const lastUpdate = useDashboardStore((state) => state.lastUpdate)
  
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never'
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 5) return 'Just now'
    if (seconds < 60) return `${seconds}s ago`
    return `${Math.floor(seconds / 60)}m ago`
  }

  return (
    <footer className="mission-footer">
      <div className="footer-left">
        <span className="footer-version">v2.0.0</span>
        <span className="footer-separator">|</span>
        <span className="footer-env">Real-Time</span>
      </div>
      <div className="footer-center">
        <span className="footer-status">
          <span className="status-dot online"></span>
          All Systems Operational
        </span>
        <span className="footer-update">
          Last update: {formatTime(lastUpdate)}
        </span>
      </div>
      <div className="footer-right">
        <span className="footer-copyright">© 2025 Mission Control</span>
      </div>
    </footer>
  )
}
