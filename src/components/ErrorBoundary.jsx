import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Widget ${this.props.widgetId} error:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="widget-error">
          <div className="widget-error-icon">⚠️</div>
          <div className="widget-error-message">
            Widget failed to load
          </div>
          <button 
            className="widget-error-retry"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
