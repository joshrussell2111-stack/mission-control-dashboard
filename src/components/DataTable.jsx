import { useState, useMemo } from 'react'

// Icons
const Icons = {
  ChevronUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  MoreHorizontal: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
}

export function DataTable({ 
  columns, 
  data, 
  rowActions = [],
  searchable = true,
  filterable = true,
  pageSize = 10,
  emptyMessage = 'No data available'
}) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [openMenuRow, setOpenMenuRow] = useState(null)

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data]
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(row => 
        columns.some(col => {
          const value = row[col.key]
          return value && String(value).toLowerCase().includes(query)
        })
      )
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(row => String(row[key]) === value)
      }
    })
    
    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }
    
    return result
  }, [data, columns, searchQuery, filters, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (columnKey, value) => {
    setFilters(prev => ({ ...prev, [columnKey]: value }))
    setCurrentPage(0)
  }

  const getUniqueValues = (columnKey) => {
    const values = [...new Set(data.map(row => row[columnKey]))].filter(Boolean)
    return values.sort()
  }

  return (
    <div className="data-table-wrapper">
      {/* Toolbar */}
      <div className="data-table-toolbar">
        {searchable && (
          <div className="table-search">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(0)
              }}
            />
          </div>
        )}
        
        {filterable && (
          <div className="table-filters">
            {columns.filter(col => col.filterable).map(col => (
              <select
                key={col.key}
                value={filters[col.key] || 'all'}
                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                className="table-filter"
              >
                <option value="all">{col.title}</option>
                {getUniqueValues(col.key).map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            ))}
          </div>
        )}
        
        <div className="table-info">
          {processedData.length} results
        </div>
      </div>
      
      {/* Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th 
                  key={col.key}
                  className={`${col.sortable !== false ? 'sortable' : ''} ${sortColumn === col.key ? `sorted-${sortDirection}` : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="th-content">
                    <span>{col.title}</span>
                    {col.sortable !== false && (
                      <span className="sort-indicator">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? <Icons.ChevronUp /> : <Icons.ChevronDown />
                        ) : (
                          <span className="sort-placeholder"><Icons.ChevronUp /></span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {rowActions.length > 0 && <th className="actions-header">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowActions.length > 0 ? 1 : 0)} className="empty-cell">
                  <div className="empty-message">
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row.id || index} className={row.status ? `status-${row.status}` : ''}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {rowActions.length > 0 && (
                    <td className="actions-cell">
                      <div className="row-actions">
                        <button 
                          className="actions-menu-btn"
                          onClick={() => setOpenMenuRow(openMenuRow === index ? null : index)}
                        >
                          <Icons.MoreHorizontal />
                        </button>
                        
                        {openMenuRow === index && (
                          <div className="actions-menu">
                            {rowActions.map(action => (
                              <button
                                key={action.label}
                                className="action-item"
                                onClick={() => {
                                  action.onClick(row)
                                  setOpenMenuRow(null)
                                }}
                              >
                                {action.icon && <span className="action-icon">{action.icon}</span>}
                                <span>{action.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <button 
            className="page-btn"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-number ${currentPage === i ? 'active' : ''}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button 
            className="page-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

// Predefined row action presets
export const RowActions = {
  view: (onView) => ({
    label: 'View',
    icon: <Icons.Eye />,
    onClick: onView,
  }),
  retry: (onRetry) => ({
    label: 'Retry',
    icon: <Icons.RefreshCw />,
    onClick: onRetry,
  }),
  copy: (onCopy) => ({
    label: 'Copy',
    icon: <Icons.Copy />,
    onClick: onCopy,
  }),
}
