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
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

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

  // Get unique platforms from problems
  const getUniquePlatforms = () => {
    const platforms = problems.map(p => p.platform).filter(Boolean)
    return ['All', ...new Set(platforms)]
  }

  // Filter and sort problems
  const getFilteredAndSortedProblems = () => {
    let filtered = [...problems]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(problem => 
        problem.title?.toLowerCase().includes(query) ||
        problem.description?.toLowerCase().includes(query) ||
        problem.platform?.toLowerCase().includes(query) ||
        problem.notes?.toLowerCase().includes(query)
      )
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(problem => 
        problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
      )
    }

    // Apply platform filter
    if (platformFilter !== 'All') {
      filtered = filtered.filter(problem => 
        problem.platform === platformFilter
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id // Assuming higher ID = newer
        case 'oldest':
          return a.id - b.id
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '')
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '')
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
        case 'review-count':
          return (b.reviewCount || 0) - (a.reviewCount || 0)
        case 'next-review':
          const dateA = a.nextReview ? new Date(a.nextReview) : new Date(9999, 11, 31)
          const dateB = b.nextReview ? new Date(b.nextReview) : new Date(9999, 11, 31)
          return dateA - dateB
        default:
          return 0
      }
    })

    return filtered
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setDifficultyFilter('All')
    setPlatformFilter('All')
    setSortBy('newest')
  }

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchQuery.trim() !== '' || 
           difficultyFilter !== 'All' || 
           platformFilter !== 'All' ||
           sortBy !== 'newest'
  }

  const filteredProblems = getFilteredAndSortedProblems()
  const uniquePlatforms = getUniquePlatforms()

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
          <span className="problem-count">
            {filteredProblems.length === problems.length 
              ? `${problems.length} ${problems.length === 1 ? 'problem' : 'problems'}`
              : `${filteredProblems.length} of ${problems.length} problems`
            }
          </span>
          <button className="add-button-header" onClick={onAddClick}>
            ➕ Add Problem
          </button>
        </div>
      </div>
      
      {/* Filter/Sort controls */}
      <div className="list-controls">
        {/* Search Box */}
        <div className="search-box">
          <input 
            type="text" 
            placeholder="🔍 Search problems..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Difficulty Filter Buttons */}
        <div className="filter-section">
          <span className="filter-label">Difficulty:</span>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${difficultyFilter === 'All' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('All')}
            >
              All
            </button>
            <button 
              className={`filter-btn filter-easy ${difficultyFilter === 'Easy' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('Easy')}
            >
              Easy
            </button>
            <button 
              className={`filter-btn filter-medium ${difficultyFilter === 'Medium' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('Medium')}
            >
              Medium
            </button>
            <button 
              className={`filter-btn filter-hard ${difficultyFilter === 'Hard' ? 'active' : ''}`}
              onClick={() => setDifficultyFilter('Hard')}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Platform Filter */}
        {uniquePlatforms.length > 1 && (
          <div className="filter-section">
            <span className="filter-label">Platform:</span>
            <div className="filter-buttons">
              {uniquePlatforms.map(platform => (
                <button 
                  key={platform}
                  className={`filter-btn ${platformFilter === platform ? 'active' : ''}`}
                  onClick={() => setPlatformFilter(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="filter-section">
          <span className="filter-label">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="difficulty">Difficulty</option>
            <option value="review-count">Most Reviewed</option>
            <option value="next-review">Next Review</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters() && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* No results message */}
      {filteredProblems.length === 0 && problems.length > 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No problems match your filters</h3>
          <p>Try adjusting your search or filters</p>
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Problems Grid */}
      {filteredProblems.length > 0 && (
        <div className="problems-grid">
          {filteredProblems.map((problem) => (
            <ProblemCard 
              key={problem.id} 
              problem={problem}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProblemList
