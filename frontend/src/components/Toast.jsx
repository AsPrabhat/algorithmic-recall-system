import { useEffect } from 'react';
import './Toast.css';

/**
 * Toast Component
 * 
 * A notification component for displaying temporary messages.
 * Automatically dismisses after a timeout.
 * 
 * Props:
 * - message: String - The message to display
 * - type: String - 'success', 'error', 'info', 'warning' (default: 'info')
 * - duration: Number - Time in ms before auto-dismiss (default: 3000)
 * - onClose: Function - Callback when toast is dismissed
 */
function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  // Get CSS class based on type
  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast ${getTypeClass()}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  );
}

export default Toast;
