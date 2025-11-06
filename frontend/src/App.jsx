import { useState, useEffect } from 'react'
import './App.css'
import ProblemList from './components/ProblemList'
import { testConnection } from './services/apiService'

function App() {
  const [backendStatus, setBackendStatus] = useState('Testing...')
  const [showStatus, setShowStatus] = useState(true)

  useEffect(() => {
    // Test backend connection on component mount
    testBackendConnection()
  }, [])

  const testBackendConnection = async () => {
    try {
      const message = await testConnection()
      setBackendStatus(`✓ Connected: ${message}`)
      // Auto-hide status after 3 seconds if successful
      setTimeout(() => setShowStatus(false), 3000)
    } catch (err) {
      setBackendStatus(`✗ Connection Failed: ${err.message}`)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 Algorithmic Recall System</h1>
        <p className="subtitle">Track and review your coding problems with spaced repetition</p>
      </header>

      <main className="app-main">
        {/* Backend Connection Status - Auto-hide on success */}
        {showStatus && (
          <section className="status-section">
            <p className={backendStatus.includes('✓') ? 'status-success' : 'status-error'}>
              {backendStatus}
            </p>
          </section>
        )}

        {/* Problem List Component */}
        <ProblemList />

        {/* Phase Progress */}
        <section className="info-section">
          <h3>🎯 Phase 4: Problem List & Display UI Complete</h3>
          <div className="phase-grid">
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>ProblemCard Component</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>ProblemList Component</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Loading States</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Error Handling</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Empty State UI</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Responsive Design</span>
            </div>
          </div>
          <p className="next-phase">Next: Phase 5 - Add/Edit Problem Form</p>
        </section>
      </main>
    </div>
  )
}

export default App
