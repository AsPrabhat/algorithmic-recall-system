import { useState, useEffect } from 'react'
import ProblemCard from './ProblemCard'
import { getAllProblems } from '../services/apiService'
import './ProblemList.css'

/**
 * ProblemList Component
 * Fetches and displays all problems from the backend
 * Handles loading, error, and empty states
 * 
 * Props:
 * - onEdit: Function - Callback when edit is requested
 * - onDelete: Function - Callback when delete is requested
 * - onAddClick: Function - Callback when add button is clicked
 * - refreshTrigger: Number - When changed, triggers a refresh
 */
function ProblemList({ onEdit, onDelete, onAddClick, refreshTrigger }) {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProblems()
  }, [refreshTrigger]) // Re-fetch when refreshTrigger changes

  const fetchProblems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProblems()
      setProblems(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch problems')
      console.error('Error fetching problems:', err)
    } finally {
      setLoading(false)
    }
  }

  // Retry function for error state
  const handleRetry = () => {
    fetchProblems()
  }

  // Loading State
  if (loading) {
    return (
      <div className="problem-list-container">
        <div className="list-header">
          <h2>📚 Your Problems</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading problems...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="problem-list-container">
        <div className="list-header">
          <h2>📚 Your Problems</h2>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <div className="error-suggestions">
            <p>Possible solutions:</p>
            <ul>
              <li>Check if the backend server is running on port 8080</li>
              <li>Verify your internet connection</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
          <button onClick={handleRetry} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (problems.length === 0) {
    return (
      <div className="problem-list-container">
        <div className="list-header">
          <h2>📚 Your Problems</h2>
          <span className="problem-count">0 problems</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No problems yet!</h3>
          <p>Start building your algorithmic knowledge base by adding your first problem.</p>
          <div className="empty-suggestions">
            <h4>Getting Started:</h4>
            <ul>
              <li>Add problems you've solved or want to solve</li>
              <li>Track your review schedule with spaced repetition</li>
              <li>Take notes on problem-solving strategies</li>
              <li>Monitor your progress over time</li>
            </ul>
          </div>
          <button className="add-button" onClick={onAddClick}>
            ➕ Add Your First Problem
          </button>
          <p className="coming-soon">(Now available!)</p>
        </div>
      </div>
    )
  }

  // Success State - Display Problems
  return (
    <div className="problem-list-container">
      <div className="list-header">
        <h2>📚 Your Problems</h2>
        <div className="header-actions">
          <span className="problem-count">{problems.length} {problems.length === 1 ? 'problem' : 'problems'}</span>
          <button className="add-button-header" onClick={onAddClick}>
            ➕ Add Problem
          </button>
        </div>
      </div>
      
      {/* Filter/Sort controls placeholder */}
      <div className="list-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="🔍 Search problems..." 
            disabled
            title="Search coming in Phase 6"
          />
        </div>
        <div className="filter-buttons">
          <button className="filter-btn" disabled>All</button>
          <button className="filter-btn" disabled>Easy</button>
          <button className="filter-btn" disabled>Medium</button>
          <button className="filter-btn" disabled>Hard</button>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="problems-grid">
        {problems.map((problem) => (
          <ProblemCard 
            key={problem.id} 
            problem={problem}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default ProblemList
