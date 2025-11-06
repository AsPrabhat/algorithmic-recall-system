import { useState, useEffect } from 'react'
import './App.css'
import ProblemList from './components/ProblemList'
import ProblemForm from './components/ProblemForm'
import Toast from './components/Toast'
import ConfirmDialog from './components/ConfirmDialog'
import { testConnection, deleteProblem } from './services/apiService'

function App() {
  const [backendStatus, setBackendStatus] = useState('Testing...')
  const [showStatus, setShowStatus] = useState(true)
  
  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingProblem, setEditingProblem] = useState(null)
  
  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [problemToDelete, setProblemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Toast notification state
  const [toast, setToast] = useState(null)
  
  // Trigger for refreshing problem list
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  // Handle add problem button
  const handleAddClick = () => {
    setEditingProblem(null)
    setShowForm(true)
  }

  // Handle edit problem
  const handleEdit = (problem) => {
    setEditingProblem(problem)
    setShowForm(true)
  }

  // Handle form success
  const handleFormSuccess = ({ mode, problem }) => {
    setShowForm(false)
    setEditingProblem(null)
    
    // Show success toast
    const message = mode === 'edit' 
      ? `✓ Successfully updated "${problem.title}"`
      : `✓ Successfully created "${problem.title}"`
    showToast(message, 'success')
    
    // Refresh problem list
    setRefreshTrigger(prev => prev + 1)
  }

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProblem(null)
  }

  // Handle delete request
  const handleDeleteRequest = (problem) => {
    setProblemToDelete(problem)
    setShowDeleteDialog(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return

    setIsDeleting(true)
    try {
      await deleteProblem(problemToDelete.id)
      setShowDeleteDialog(false)
      setProblemToDelete(null)
      showToast(`✓ Successfully deleted "${problemToDelete.title}"`, 'success')
      
      // Refresh problem list
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      showToast(`✗ Failed to delete problem: ${error.message}`, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle delete cancel
  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false)
      setProblemToDelete(null)
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

        {/* Problem Form Modal */}
        {showForm && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <ProblemForm 
                problem={editingProblem}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Delete Problem?"
          message={`Are you sure you want to delete "${problemToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={isDeleting}
          variant="danger"
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Problem List Component */}
        <ProblemList 
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onAddClick={handleAddClick}
          refreshTrigger={refreshTrigger}
        />

        {/* Phase Progress */}
        <section className="info-section">
          <h3>🎯 Phase 5: Add/Edit Problem Form Complete</h3>
          <div className="phase-grid">
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>ProblemForm Component</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Form Validation</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Create/Edit Modes</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Delete Functionality</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Toast Notifications</span>
            </div>
            <div className="phase-item completed">
              <span className="phase-icon">✅</span>
              <span>Confirmation Dialogs</span>
            </div>
          </div>
          <p className="next-phase">Next: Phase 6 - Search & Filter</p>
        </section>
      </main>
    </div>
  )
}

export default App
