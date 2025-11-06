import './ConfirmDialog.css';

/**
 * ConfirmDialog Component
 * 
 * A modal dialog for confirming destructive actions.
 * 
 * Props:
 * - isOpen: Boolean - Whether dialog is visible
 * - title: String - Dialog title
 * - message: String - Confirmation message
 * - confirmText: String - Text for confirm button (default: 'Confirm')
 * - cancelText: String - Text for cancel button (default: 'Cancel')
 * - onConfirm: Function - Callback when confirmed
 * - onCancel: Function - Callback when cancelled
 * - isLoading: Boolean - Whether action is in progress
 * - variant: String - 'danger', 'warning', 'info' (default: 'danger')
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger'
}) {
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  // Handle escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isLoading) {
      onCancel();
    }
  };

  return (
    <div
      className="confirm-dialog-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className={`confirm-dialog confirm-dialog-${variant}`}>
        <div className="confirm-dialog-header">
          <h3 id="confirm-dialog-title" className="confirm-dialog-title">
            {title}
          </h3>
        </div>

        <div className="confirm-dialog-body">
          <p className="confirm-dialog-message">{message}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn btn-${variant}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
