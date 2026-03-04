export function WidgetHeader({ title, badge, badgeClass = 'default', children }) {
  return (
    <div className="widget-header">
      <h3 className="widget-title">{title}</h3>
      {badge && (
        <span className={`widget-badge ${badgeClass}`}>
          {badgeClass === 'live' && <span className="pulse-dot"></span>}
          {badge}
        </span>
      )}
      {children}
    </div>
  )
}
