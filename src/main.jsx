import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  console.log('Root element found, mounting app...')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
}

