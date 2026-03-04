import { useState, useEffect, useRef, useMemo } from 'react'
import { useDashboardStore } from '../stores/dashboardStore.js'

const commands = [
  { id: 'goto-dashboard', label: 'Go to Dashboard', category: 'Navigation', icon: 'LayoutDashboard', action: () => {} },
  { id: 'goto-models', label: 'Go to Models', category: 'Navigation', icon: 'Brain', action: () => {} },
  { id: 'goto-subagents', label: 'Go to Subagents', category: 'Navigation', icon: 'Bot', action: () => {} },
  { id: 'goto-logs', label: 'Go to Logs', category: 'Navigation', icon: 'ScrollText', action: () => {} },
  { id: 'goto-analytics', label: 'Go to Analytics', category: 'Navigation', icon: 'BarChart3', action: () => {} },
  { id: 'goto-settings', label: 'Go to Settings', category: 'Navigation', icon: 'Settings', action: () => {} },
  
  { id: 'toggle-live', label: 'Toggle Live Mode', category: 'Actions', icon: 'Activity', action: (store) => store.toggleLiveMode() },
  { id: 'toggle-edit', label: 'Toggle Edit Mode', category: 'Actions', icon: 'Edit', action: (store) => store.toggleEditMode() },
  { id: 'reset-layout', label: 'Reset Layout', category: 'Actions', icon: 'RefreshCw', action: (store) => store.resetLayout() },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', category: 'Actions', icon: 'PanelLeft', action: (store) => store.toggleSidebar() },
  
  { id: 'model-kimi', label: 'Switch to Kimi K2.5', category: 'Models', icon: 'Zap', action: () => {} },
  { id: 'model-claude', label: 'Switch to Claude 3.5', category: 'Models', icon: 'Zap', action: () => {} },
  { id: 'model-openrouter', label: 'Switch to OpenRouter', category: 'Models', icon: 'Zap', action: () => {} },
  
  { id: 'view-1h', label: 'View Last 1 Hour', category: 'Time Range', icon: 'Clock', action: (store) => store.setTimeRange('1h') },
  { id: 'view-24h', label: 'View Last 24 Hours', category: 'Time Range', icon: 'Clock', action: (store) => store.setTimeRange('24h') },
  { id: 'view-7d', label: 'View Last 7 Days', category: 'Time Range', icon: 'Clock', action: (store) => store.setTimeRange('7d') },
  { id: 'view-30d', label: 'View Last 30 Days', category: 'Time Range', icon: 'Clock', action: (store) => store.setTimeRange('30d') },
]

// Icon components
const Icons = {
  LayoutDashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  ),
  Brain: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
    </svg>
  ),
  ScrollText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3"/>
    </svg>
  ),
  BarChart3: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  PanelLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Command: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
    </svg>
  ),
}

export function CommandPalette() {
  const isOpen = useDashboardStore((state) => state.commandPaletteOpen)
  const closeCommandPalette = useDashboardStore((state) => state.closeCommandPalette)
  const addRecentCommand = useDashboardStore((state) => state.addRecentCommand)
  const recentCommands = useDashboardStore((state) => state.recentCommands)
  const store = useDashboardStore()
  
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) {
      // Show recent commands first, then all commands
      const recent = recentCommands
        .map(id => commands.find(c => c.id === id))
        .filter(Boolean)
      const others = commands.filter(c => !recentCommands.includes(c.id))
      return [...recent, ...others]
    }
    
    const query = search.toLowerCase()
    return commands.filter(cmd => 
      cmd.label.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    )
  }, [search, recentCommands])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups = {}
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCommandPalette()
        return
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = filteredCommands[selectedIndex]
        if (selected) {
          executeCommand(selected)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, closeCommandPalette])

  const executeCommand = (command) => {
    command.action(store)
    addRecentCommand(command.id)
    closeCommandPalette()
  }

  if (!isOpen) return null

  return (
    <div className="command-palette-overlay" onClick={closeCommandPalette}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-palette-header">
          <Icons.Search />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="command-input"
          />
          <kbd className="command-kbd">ESC</kbd>
        </div>
        
        <div className="command-palette-content">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="command-group">
              <div className="command-group-label">{category}</div>
              {cmds.map((command, idx) => {
                const globalIndex = filteredCommands.indexOf(command)
                const Icon = Icons[command.icon] || Icons.Command
                const isSelected = globalIndex === selectedIndex
                
                return (
                  <button
                    key={command.id}
                    className={`command-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    <span className="command-icon"><Icon /></span>
                    <span className="command-label">{command.label}</span>
                    {recentCommands.includes(command.id) && (
                      <span className="command-recent">Recent</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="command-empty">
              <p>No commands found</p>
              <p>Try a different search term</p>
            </div>
          )}
        </div>
        
        <div className="command-palette-footer">
          <div className="command-hint">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="command-hint">
            <kbd>↵</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}
