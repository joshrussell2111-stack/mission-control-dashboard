export function SparklineChart({ data, color = '#00D4FF', height = 40 }) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  
  const width = 100
  const padding = 2
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - ((value - min) / range) * (height - padding * 2) - padding
    return `${x},${y}`
  }).join(' ')

  return (
    <svg 
      className="sparkline" 
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: `${height}px` }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={points.split(' ').pop().split(',')[0]}
        cy={points.split(' ').pop().split(',')[1]}
        r="3"
        fill={color}
      />
    </svg>
  )
}
