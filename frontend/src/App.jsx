import { useState, useEffect } from 'react'
import './App.css'
import { testConnection, getAllProblems } from './services/apiService'

function App() {
  const [backendStatus, setBackendStatus] = useState('Testing...')
  const [problems, setProblems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Test backend connection on component mount
    testBackendConnection()
    fetchProblems()
  }, [])

  const testBackendConnection = async () => {
    try {
      const message = await testConnection()
      setBackendStatus(`✓ Connected: ${message}`)
    } catch (err) {
      setBackendStatus(`✗ Connection Failed: ${err.message}`)
      setError('Backend connection failed. Make sure Spring Boot is running on port 8080.')
    }
  }

  const fetchProblems = async () => {
    try {
      const data = await getAllProblems()
      setProblems(data)
    } catch (err) {
      console.error('Failed to fetch problems:', err)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧠 Algorithmic Recall System</h1>
        <p className="subtitle">Track and review your coding problems with spaced repetition</p>
      </header>

      <main className="app-main">
        {/* Backend Connection Status */}
        <section className="status-section">
          <h2>Backend Status</h2>
          <p className={backendStatus.includes('✓') ? 'status-success' : 'status-error'}>
            {backendStatus}
          </p>
          {error && <p className="error-message">{error}</p>}
        </section>

        {/* Problems List */}
        <section className="problems-section">
          <h2>Problems ({problems.length})</h2>
          {problems.length === 0 ? (
            <p className="no-data">No problems found. Add your first problem!</p>
          ) : (
            <div className="problems-list">
              {problems.map((problem) => (
                <div key={problem.id} className="problem-card">
                  <h3>{problem.title}</h3>
                  <p><strong>Platform:</strong> {problem.platform}</p>
                  <p><strong>Difficulty:</strong> {problem.difficulty}</p>
                  {problem.notes && <p className="notes">{problem.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Info */}
        <section className="info-section">
          <h3>🚀 Phase 3: Frontend Setup Complete</h3>
          <ul>
            <li>✓ React + Vite initialized</li>
            <li>✓ API service created</li>
            <li>✓ Backend connection tested</li>
            <li>✓ Problem fetching working</li>
          </ul>
          <p className="next-phase">Next: Phase 4 - Problem List & Display UI</p>
        </section>
      </main>
    </div>
  )
}

export default App
