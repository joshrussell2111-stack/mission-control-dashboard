import { useDashboardStore } from '../stores/dashboardStore.js'

export function Breadcrumbs() {
  const breadcrumbs = useDashboardStore((state) => state.breadcrumbs)

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <li key={index} className="breadcrumb-item">
              {index > 0 && (
                <span className="breadcrumb-separator">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
              )}
              {isLast ? (
                <span className="breadcrumb-current">{crumb.label}</span>
              ) : (
                <a href={crumb.path} className="breadcrumb-link">{crumb.label}</a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
