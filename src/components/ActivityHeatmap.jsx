import { useMemo } from 'react'
import { useSubagentStore } from '../stores/dashboardStore.js'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function ActivityHeatmap() {
  const activityHeatmap = useSubagentStore((state) => state.activityHeatmap)
  const subagents = useSubagentStore((state) => state.subagents)

  // Generate heatmap data for the last 7 days, 24 hours
  const heatmapData = useMemo(() => {
    const now = Date.now()
    const oneHour = 3600000
    const data = []
    
    subagents.forEach(agent => {
      const agentData = []
      for (let day = 6; day >= 0; day--) {
        const dayData = []
        for (let hour = 0; hour < 24; hour++) {
          const hourStart = now - (day * 24 + hour) * oneHour
          const hourEnd = hourStart + oneHour
          
          // Count activities in this hour
          const activities = activityHeatmap.filter(a => 
            a.subagentId === agent.id &&
            a.timestamp >= hourStart &&
            a.timestamp < hourEnd
          )
          
          const intensity = activities.reduce((sum, a) => sum + (a.intensity || 1), 0)
          dayData.push(intensity)
        }
        agentData.push(dayData)
      }
      data.push({ agent, activity: agentData })
    })
    
    return data
  }, [activityHeatmap, subagents])

  // Calculate max intensity for color scaling
  const maxIntensity = useMemo(() => {
    let max = 0
    heatmapData.forEach(({ activity }) => {
      activity.forEach(day => {
        day.forEach(hour => {
          max = Math.max(max, hour)
        })
      })
    })
    return max || 1
  }, [heatmapData])

  const getIntensityColor = (intensity) => {
    const ratio = intensity / maxIntensity
    if (ratio === 0) return 'var(--heatmap-0)'
    if (ratio < 0.25) return 'var(--heatmap-1)'
    if (ratio < 0.5) return 'var(--heatmap-2)'
    if (ratio < 0.75) return 'var(--heatmap-3)'
    return 'var(--heatmap-4)'
  }

  const getIntensityLabel = (intensity) => {
    if (intensity === 0) return 'No activity'
    if (intensity === 1) return `${intensity} task`
    return `${intensity} tasks`
  }

  return (
    <div className="activity-heatmap glass-card">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Subagent Activity</h3>
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-cells">
            <div className="legend-cell" style={{ background: 'var(--heatmap-0)' }}></div>
            <div className="legend-cell" style={{ background: 'var(--heatmap-1)' }}></div>
            <div className="legend-cell" style={{ background: 'var(--heatmap-2)' }}></div>
            <div className="legend-cell" style={{ background: 'var(--heatmap-3)' }}></div>
            <div className="legend-cell" style={{ background: 'var(--heatmap-4)' }}></div>
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="heatmap-content">
        {heatmapData.map(({ agent, activity }) => (
          <div key={agent.id} className="heatmap-row">
            <div className="heatmap-agent">
              <div className={`agent-status-dot status-${agent.status}`}></div>
              <span className="agent-name">{agent.name}</span>
            </div>
            <div className="heatmap-cells">
              {activity.map((day, dayIndex) => (
                <div key={dayIndex} className="heatmap-day">
                  {day.map((intensity, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="heatmap-cell"
                      style={{ backgroundColor: getIntensityColor(intensity) }}
                      title={`${agent.name} - ${DAYS[dayIndex]} ${hourIndex}:00 - ${getIntensityLabel(intensity)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="heatmap-footer">
        <div className="heatmap-hours">
          {HOURS.filter(h => h % 4 === 0).map(hour => (
            <span key={hour} className="hour-label">{hour}:00</span>
          ))}
        </div>
      </div>
    </div>
  )
}
