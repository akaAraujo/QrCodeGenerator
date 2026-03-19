import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h2>Algo deu errado 😕</h2>

          {/* ← Mostra o erro real na tela */}
          <pre style={{
            background: '#fee', color: '#c00',
            padding: '1rem', borderRadius: '8px',
            fontSize: '0.75rem', whiteSpace: 'pre-wrap',
            wordBreak: 'break-all', marginTop: '1rem'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>

          <button onClick={() => window.location.reload()}
            style={{ padding: '0.75rem 1.5rem', marginTop: '1rem',
              background: '#25D366', color: 'white', border: 'none',
              borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)