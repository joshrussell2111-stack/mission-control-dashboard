import { useState, useEffect, useRef } from 'react'
import { WidgetHeader } from '../components/WidgetHeader.jsx'
import './ActivityFeedWidget.css'

export default function ActivityFeedWidget() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'info', time: '11:40:32', badge: 'INFO', message: 'Dashboard initialized' },
    { id: 2, type: 'success', time: '11:39:15', badge: 'SUCCESS', message: 'Subagent completed: market-analysis' },
    { id: 3, type: 'warning', time: '11:38:42', badge: 'WARN', message: 'High latency detected on OpenRouter' },
    { id: 4, type: 'info', time: '11:35:10', badge: 'INFO', message: 'Model switched to Kimi K2.5' },
    { id: 5, type: 'success', time: '11:30:22', badge: 'SUCCESS', message: 'Gateway restarted successfully' },
  ])
  const [isPaused, setIsPaused] = useState(false)
  const listRef = useRef(null)

  // Simulate new activities
  useEffect(() => {
    if (isPaused) return
    
    const messages = [
      { type: 'info', badge: 'INFO', message: 'Health check passed' },
      { type: 'success', badge: 'SUCCESS', message: 'Request processed successfully' },
      { type: 'warning', badge: 'WARN', message: 'Rate limit approaching' },
      { type: 'info', badge: 'INFO', message: 'Token usage updated' },
      { type: 'success', badge: 'SUCCESS', message: 'Cache refreshed' },
    ]
    
    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)]
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      
      setActivities((prev) => [
        { id: Date.now(), time, ...randomMsg },
        ...prev.slice(0, 49),
      ])
    }, 8000)
    
    return () => clearInterval(interval)
  }, [isPaused])

  const clearFeed = () => setActivities([])

  return (
    <div className="activity-feed-widget">
      <WidgetHeader title="Activity Feed">
        <div className="feed-controls">
          <button 
            className="btn-icon" 
            onClick={clearFeed}
            title="Clear feed"
          >
            ⌫
          </button>
          <button 
            className={`btn-icon ${isPaused ? 'active' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>
      </WidgetHeader>
      
      <div className="activity-list" ref={listRef}>
        {activities.map((activity) => (
          <div key={activity.id} className={`activity-item ${activity.type}`}>
            <span className="activity-time">{activity.time}</span>
            <span className={`activity-badge ${activity.type}`}>{activity.badge}</span>
            <span className="activity-message">{activity.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
