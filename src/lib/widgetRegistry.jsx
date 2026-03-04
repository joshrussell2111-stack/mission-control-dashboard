import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary.jsx'
import { WidgetSkeleton } from '../components/WidgetSkeleton.jsx'

// Widget registry with lazy loading for code splitting
export const widgetRegistry = {
  'model-status': {
    component: lazy(() => import('../widgets/ModelStatusWidget')),
    title: 'Model Routing',
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 3, h: 3 },
  },
  'model-router': {
    component: lazy(() => import('../widgets/ModelRouterWidget')),
    title: 'Model Router',
    defaultSize: { w: 6, h: 6 },
    minSize: { w: 4, h: 4 },
  },
  'session-metrics': {
    component: lazy(() => import('../widgets/SessionMetricsWidget')),
    title: 'Session Metrics',
    defaultSize: { w: 3, h: 4 },
    minSize: { w: 2, h: 3 },
  },
  'token-usage': {
    component: lazy(() => import('../widgets/TokenUsageWidget')),
    title: 'Token Usage',
    defaultSize: { w: 3, h: 4 },
    minSize: { w: 2, h: 3 },
  },
  'activity-feed': {
    component: lazy(() => import('../widgets/ActivityFeedWidget')),
    title: 'Activity Feed',
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
  },
  'activity-heatmap': {
    component: lazy(() => import('../components/ActivityHeatmap')),
    title: 'Activity Heatmap',
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
  },
  'quick-actions': {
    component: lazy(() => import('../widgets/QuickActionsWidget')),
    title: 'Quick Actions',
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
  },
  'resources': {
    component: lazy(() => import('../widgets/ResourcesWidget')),
    title: 'Resource Metrics',
    defaultSize: { w: 4, h: 6 },
    minSize: { w: 3, h: 4 },
  },
  'request-logs': {
    component: lazy(() => import('../widgets/RequestLogsWidget')),
    title: 'Request Logs',
    defaultSize: { w: 8, h: 6 },
    minSize: { w: 6, h: 4 },
  },
}

export function getWidgetComponent(widgetId) {
  const widget = widgetRegistry[widgetId]
  if (!widget) return null
  
  const Component = widget.component
  
  return (
    <ErrorBoundary widgetId={widgetId}>
      <Suspense fallback={<WidgetSkeleton />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}

export function getWidgetTitle(widgetId) {
  return widgetRegistry[widgetId]?.title || widgetId
}

export function getWidgetDefaultSize(widgetId) {
  return widgetRegistry[widgetId]?.defaultSize || { w: 3, h: 3 }
}

export function getWidgetMinSize(widgetId) {
  return widgetRegistry[widgetId]?.minSize || { w: 2, h: 2 }
}
