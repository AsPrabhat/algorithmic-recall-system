import './ProblemCard.css'

/**
 * ProblemCard Component
 * Displays a single problem with all its details in a card format
 * 
 * Props:
 * - problem: Object - The problem data to display
 * - onEdit: Function - Callback when edit button is clicked
 * - onDelete: Function - Callback when delete button is clicked
 */
function ProblemCard({ problem, onEdit, onDelete }) {
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Get difficulty color
  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy'
      case 'medium':
        return 'difficulty-medium'
      case 'hard':
        return 'difficulty-hard'
      default:
        return ''
    }
  }

  return (
    <div className="problem-card">
      {/* Header with title and difficulty badge */}
      <div className="card-header">
        <h3 className="card-title">{problem.title}</h3>
        <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </div>

      {/* Description */}
      {problem.description && (
        <p className="card-description">{problem.description}</p>
      )}

      {/* Platform and URL */}
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Platform:</span>
          <span className="meta-value">{problem.platform}</span>
        </div>
        {problem.url && (
          <a 
            href={problem.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="problem-link"
          >
            View Problem →
          </a>
        )}
      </div>

      {/* Review Information */}
      <div className="card-review">
        <div className="review-item">
          <span className="review-label">Reviews:</span>
          <span className="review-count">{problem.reviewCount || 0}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Last Reviewed:</span>
          <span className="review-date">{formatDate(problem.lastReviewed)}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Next Review:</span>
          <span className="review-date">{formatDate(problem.nextReview)}</span>
        </div>
      </div>

      {/* Notes */}
      {problem.notes && (
        <div className="card-notes">
          <p className="notes-label">Notes:</p>
          <p className="notes-content">{problem.notes}</p>
        </div>
      )}

      {/* Action buttons placeholder for future phases */}
      <div className="card-actions">
        <button 
          className="btn-secondary" 
          title="Edit problem"
          onClick={() => onEdit && onEdit(problem)}
        >
          ✏️ Edit
        </button>
        <button 
          className="btn-danger" 
          title="Delete problem"
          onClick={() => onDelete && onDelete(problem)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

export default ProblemCard
