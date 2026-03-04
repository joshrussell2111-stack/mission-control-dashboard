import { useState } from 'react'
import { DataTable, RowActions } from '../components/DataTable.jsx'
import { WidgetHeader } from '../components/WidgetHeader.jsx'

// Sample data for the DataTable
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
]

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

export default function RequestLogsWidget() {
  const [logs, setLogs] = useState(sampleRequestLogs)

  const handleViewDetails = (row) => {
    console.log('View details:', row)
  }

  const handleRetry = (row) => {
    console.log('Retry:', row)
    // Simulate retry by updating status
    setLogs(prev => prev.map(log => 
      log.id === row.id ? { ...log, status: 'success', duration: '0.8s' } : log
    ))
  }

  const handleCopy = (row) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2))
  }

  const rowActions = [
    RowActions.view(handleViewDetails),
    RowActions.retry(handleRetry),
    RowActions.copy(handleCopy),
  ]

  return (
    <div className="request-logs-widget" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <WidgetHeader title="Request Logs" badge="LIVE" badgeClass="live" />
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px 16px' }}>
        <DataTable 
          columns={tableColumns}
          data={logs}
          rowActions={rowActions}
          pageSize={6}
        />
      </div>
    </div>
  )
}
