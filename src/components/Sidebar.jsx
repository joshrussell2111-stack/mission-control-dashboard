import { useState, useEffect } from 'react'
import { useDashboardStore } from '../stores/dashboardStore.js'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', shortcut: 'D' },
  { id: 'models', label: 'Models', icon: 'Brain', shortcut: 'M' },
  { id: 'subagents', label: 'Subagents', icon: 'Bot', shortcut: 'S' },
  { id: 'logs', label: 'Logs', icon: 'ScrollText', shortcut: 'L' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', shortcut: 'A' },
  { id: 'settings', label: 'Settings', icon: 'Settings', shortcut: ',' },
]

// Icon components
const Icons = {
  LayoutDashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  ),
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
    </svg>
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  ),
  ScrollText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3"/><path d="M8 3h12a2 2 0 0 1 2 2v12"/>
      <path d="M10 5h8"/><path d="M10 9h8"/><path d="M10 13h8"/>
    </svg>
  ),
  BarChart3: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect width="4" height="10" x="7" y="8" rx="1"/>
      <rect width="4" height="5" x="15" y="13" rx="1"/>
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  Pin: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14"/>
      <path d="M10 9.05s-1.5-.818-2.667.364C6.167 10.6 7 12.133 7 14"/>
      <path d="m14 14.1 2.667.9c1.167 1.182 2.667.364 2.667.364"/>
      <path d="M15.133 10.2a3.23 3.23 0 0 0 .966-2.25 3.23 3.23 0 0 0-3.233-3.234 3.23 3.23 0 0 0-3.234 3.234 3.23 3.23 0 0 0 .967 2.25"/>
    </svg>
  ),
}

export function Sidebar() {
  const collapsed = useDashboardStore((state) => state.sidebarCollapsed)
  const pinned = useDashboardStore((state) => state.sidebarPinned)
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar)
  const togglePinned = useDashboardStore((state) => state.toggleSidebarPinned)
  const openCommandPalette = useDashboardStore((state) => state.openCommandPalette)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [hovered, setHovered] = useState(false)

  const shouldExpand = !collapsed || (hovered && !pinned)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'b') {
          e.preventDefault()
          toggleSidebar()
        }
        if (e.key === 'k') {
          e.preventDefault()
          openCommandPalette()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar, openCommandPalette])

  return (
    <aside 
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${shouldExpand ? 'expanded' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sidebar-header">
        {shouldExpand ? (
          <>
            <div className="sidebar-brand">
              <div className="brand-icon">🔥</div>
              <span className="brand-text">Mission Control</span>
            </div>
            <div className="sidebar-controls">
              <button 
                className={`pin-btn ${pinned ? 'pinned' : ''}`}
                onClick={togglePinned}
                title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                <Icons.Pin />
              </button>
              <button 
                className="collapse-btn"
                onClick={toggleSidebar}
                title="Collapse sidebar"
              >
                <Icons.ChevronLeft />
              </button>
            </div>
          </>
        ) : (
          <button 
            className="expand-btn"
            onClick={toggleSidebar}
            title="Expand sidebar"
          >
            <Icons.ChevronRight />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = Icons[item.icon]
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveItem(item.id)}
              title={!shouldExpand ? item.label : undefined}
            >
              <span className="nav-icon"><Icon /></span>
              {shouldExpand && (
                <>
                  <span className="nav-label">{item.label}</span>
                  <kbd className="nav-shortcut">⌘{item.shortcut}</kbd>
                </>
              )}
            </button>
          )
        })}
      </nav>

      {shouldExpand && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">P</div>
            <div className="user-details">
              <span className="user-name">Professor</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
