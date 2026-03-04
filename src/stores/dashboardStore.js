import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      // Layout state
      layout: [
        { i: 'model-status', x: 0, y: 0, w: 6, h: 4 },
        { i: 'model-router', x: 6, y: 0, w: 6, h: 4 },
        { i: 'session-metrics', x: 0, y: 4, w: 3, h: 4 },
        { i: 'token-usage', x: 3, y: 4, w: 3, h: 4 },
        { i: 'activity-heatmap', x: 6, y: 4, w: 6, h: 4 },
        { i: 'activity-feed', x: 0, y: 8, w: 4, h: 6 },
        { i: 'quick-actions', x: 4, y: 8, w: 4, h: 6 },
        { i: 'resources', x: 8, y: 8, w: 4, h: 6 },
        { i: 'request-logs', x: 0, y: 14, w: 12, h: 6 },
      ],
      
      // Widget visibility
      visibleWidgets: ['model-status', 'model-router', 'session-metrics', 'token-usage', 'activity-heatmap', 'activity-feed', 'quick-actions', 'resources', 'request-logs'],
      
      // Real-time connection state
      wsConnected: false,
      sseConnected: false,
      lastUpdate: null,
      
      // Global dashboard state
      isEditMode: false,
      selectedTimeRange: '24h',
      isLiveMode: true,
      
      // Sidebar state
      sidebarCollapsed: false,
      sidebarPinned: true,
      
      // Breadcrumbs
      breadcrumbs: [
        { label: 'Mission Control', path: '/' },
      ],
      
      // Command palette
      commandPaletteOpen: false,
      recentCommands: [],
      
      // Activity log filters
      logFilters: {
        search: '',
        level: 'all',
        agent: 'all',
        timeRange: '1h',
      },
      
      // Actions
      setLayout: (layout) => set({ layout }),
      
      toggleWidget: (widgetId) => {
        const { visibleWidgets } = get()
        if (visibleWidgets.includes(widgetId)) {
          set({ visibleWidgets: visibleWidgets.filter(id => id !== widgetId) })
        } else {
          set({ visibleWidgets: [...visibleWidgets, widgetId] })
        }
      },
      
      setWsConnected: (connected) => set({ wsConnected: connected }),
      setSseConnected: (connected) => set({ sseConnected: connected }),
      setLastUpdate: () => set({ lastUpdate: Date.now() }),
      
      setEditMode: (mode) => set({ isEditMode: mode }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      
      setTimeRange: (range) => set({ selectedTimeRange: range }),
      
      // Live mode
      setLiveMode: (live) => set({ isLiveMode: live }),
      toggleLiveMode: () => set((state) => ({ isLiveMode: !state.isLiveMode })),
      
      // Sidebar
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarPinned: () => set((state) => ({ sidebarPinned: !state.sidebarPinned })),
      
      // Breadcrumbs
      setBreadcrumbs: (crumbs) => set({ breadcrumbs: crumbs }),
      addBreadcrumb: (crumb) => set((state) => ({ 
        breadcrumbs: [...state.breadcrumbs, crumb] 
      })),
      
      // Command palette
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      addRecentCommand: (command) => set((state) => ({
        recentCommands: [command, ...state.recentCommands.slice(0, 9)]
      })),
      
      // Log filters
      setLogFilters: (filters) => set((state) => ({ 
        logFilters: { ...state.logFilters, ...filters } 
      })),
      
      // Reset layout to default
      resetLayout: () => set({
        layout: [
          { i: 'model-status', x: 0, y: 0, w: 6, h: 4 },
          { i: 'model-router', x: 6, y: 0, w: 6, h: 4 },
          { i: 'session-metrics', x: 0, y: 4, w: 3, h: 4 },
          { i: 'token-usage', x: 3, y: 4, w: 3, h: 4 },
          { i: 'activity-heatmap', x: 6, y: 4, w: 6, h: 4 },
          { i: 'activity-feed', x: 0, y: 8, w: 4, h: 6 },
          { i: 'quick-actions', x: 4, y: 8, w: 4, h: 6 },
          { i: 'resources', x: 8, y: 8, w: 4, h: 6 },
          { i: 'request-logs', x: 0, y: 14, w: 12, h: 6 },
        ],
        visibleWidgets: ['model-status', 'model-router', 'session-metrics', 'token-usage', 'activity-heatmap', 'activity-feed', 'quick-actions', 'resources', 'request-logs'],
      }),
    }),
    {
      name: 'mission-control-dashboard',
      partialize: (state) => ({
        layout: state.layout,
        visibleWidgets: state.visibleWidgets,
        selectedTimeRange: state.selectedTimeRange,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarPinned: state.sidebarPinned,
        recentCommands: state.recentCommands,
      }),
    }
  )
)

// Model-specific store for real-time updates
export const useModelStore = create((set, get) => ({
  models: {
    kimi: { name: 'Kimi K2.5', status: 'active', latency: 45, tokensIn: 0, tokensOut: 0, lastUsed: Date.now() },
    claude: { name: 'Claude 3.5', status: 'standby', latency: null, tokensIn: 0, tokensOut: 0, lastUsed: null },
    openrouter: { name: 'OpenRouter', status: 'active', latency: 120, tokensIn: 0, tokensOut: 0, lastUsed: Date.now() },
  },
  currentModel: 'kimi',
  
  updateModel: (modelId, data) => {
    set((state) => ({
      models: {
        ...state.models,
        [modelId]: { ...state.models[modelId], ...data },
      },
    }))
  },
  
  setCurrentModel: (modelId) => set({ currentModel: modelId }),
  
  updateLatency: (modelId, latency) => {
    get().updateModel(modelId, { latency, lastUsed: Date.now() })
  },
  
  addTokens: (modelId, input, output) => {
    const model = get().models[modelId]
    if (model) {
      set((state) => ({
        models: {
          ...state.models,
          [modelId]: {
            ...model,
            tokensIn: model.tokensIn + input,
            tokensOut: model.tokensOut + output,
          },
        },
      }))
    }
  },
}))

// Session metrics store
export const useSessionStore = create((set, get) => ({
  sessions: [],
  activeSessions: 0,
  totalRequests: 0,
  avgResponseTime: 0,
  tokenHistory: [],
  
  // Session history for sparkline
  addMetricPoint: (data) => {
    set((state) => ({
      tokenHistory: [...state.tokenHistory.slice(-50), {
        timestamp: Date.now(),
        ...data,
      }],
    }))
  },
  
  updateSessionStats: (stats) => set({ ...stats }),
  
  clearHistory: () => set({ tokenHistory: [] }),
}))

// Subagent activity store for heatmap
export const useSubagentStore = create((set, get) => ({
  subagents: [
    { id: 'scout', name: 'Scout', status: 'idle', lastActive: null, tasksCompleted: 0, tasksFailed: 0 },
    { id: 'pixel', name: 'Pixel', status: 'active', lastActive: Date.now(), tasksCompleted: 145, tasksFailed: 2 },
    { id: 'sage', name: 'Sage', status: 'standby', lastActive: Date.now() - 3600000, tasksCompleted: 89, tasksFailed: 0 },
    { id: 'muse', name: 'Muse', status: 'idle', lastActive: Date.now() - 7200000, tasksCompleted: 34, tasksFailed: 1 },
  ],
  activityHeatmap: [],
  
  updateSubagent: (id, data) => {
    set((state) => ({
      subagents: state.subagents.map(agent => 
        agent.id === id ? { ...agent, ...data } : agent
      )
    }))
  },
  
  addActivityPoint: (subagentId, intensity = 1) => {
    set((state) => ({
      activityHeatmap: [...state.activityHeatmap.slice(-168), {
        subagentId,
        timestamp: Date.now(),
        intensity,
      }]
    }))
  },
  
  recordTaskCompletion: (subagentId, success = true) => {
    const agent = get().subagents.find(a => a.id === subagentId)
    if (agent) {
      set((state) => ({
        subagents: state.subagents.map(a => 
          a.id === subagentId ? {
            ...a,
            lastActive: Date.now(),
            tasksCompleted: success ? a.tasksCompleted + 1 : a.tasksCompleted,
            tasksFailed: success ? a.tasksFailed : a.tasksFailed + 1,
            status: 'active',
          } : a
        )
      }))
      get().addActivityPoint(subagentId, success ? 2 : 1)
    }
  },
}))
