import { useState, useEffect } from 'react';
import { createProblem, updateProblem } from '../services/apiService';
import './ProblemForm.css';

/**
 * ProblemForm Component
 * 
 * A comprehensive form for creating and editing coding problems.
 * Supports both add and edit modes with validation.
 * 
 * Props:
 * - problem: Object (optional) - Existing problem to edit, null for add mode
 * - onSuccess: Function - Callback when form is successfully submitted
 * - onCancel: Function - Callback when form is cancelled
 */
function ProblemForm({ problem = null, onSuccess, onCancel }) {
  // Determine if we're editing or creating
  const isEditMode = problem !== null;

  // Form state - initialize with problem data if editing, empty if creating
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    platform: '',
    url: '',
    lastReviewed: '',
    nextReview: '',
    reviewCount: 0,
    notes: ''
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Populate form when editing
  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title || '',
        description: problem.description || '',
        difficulty: problem.difficulty || 'Medium',
        platform: problem.platform || '',
        url: problem.url || '',
        lastReviewed: problem.lastReviewed || '',
        nextReview: problem.nextReview || '',
        reviewCount: problem.reviewCount || 0,
        notes: problem.notes || ''
      });
    }
  }, [problem]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform is required';
    }

    // URL validation (if provided)
    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    // Date validation (if provided)
    if (formData.lastReviewed && !isValidDate(formData.lastReviewed)) {
      newErrors.lastReviewed = 'Invalid date format';
    }
    if (formData.nextReview && !isValidDate(formData.nextReview)) {
      newErrors.nextReview = 'Invalid date format';
    }

    // Review count validation
    if (formData.reviewCount < 0) {
      newErrors.reviewCount = 'Review count cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (urlString) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // Date validation helper
  const isValidDate = (dateString) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Prepare data (convert empty strings to null)
      const dataToSubmit = {
        ...formData,
        url: formData.url || null,
        lastReviewed: formData.lastReviewed || null,
        nextReview: formData.nextReview || null,
        notes: formData.notes || null,
        description: formData.description || null,
        reviewCount: parseInt(formData.reviewCount) || 0
      };

      if (isEditMode) {
        // Update existing problem
        await updateProblem(problem.id, dataToSubmit);
      } else {
        // Create new problem
        await createProblem(dataToSubmit);
      }

      // Success - call parent callback
      onSuccess({
        mode: isEditMode ? 'edit' : 'create',
        problem: dataToSubmit
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setApiError(error.message || 'Failed to save problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="problem-form-container">
      <div className="problem-form-header">
        <h2>{isEditMode ? 'Edit Problem' : 'Add New Problem'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="problem-form">
        {/* API Error Display */}
        {apiError && (
          <div className="form-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label required">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="e.g., Two Sum"
            disabled={isSubmitting}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Describe the problem..."
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        {/* Difficulty and Platform Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty" className="form-label required">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className={`form-select ${errors.difficulty ? 'error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {errors.difficulty && <span className="error-message">{errors.difficulty}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="platform" className="form-label required">
              Platform
            </label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className={`form-input ${errors.platform ? 'error' : ''}`}
              placeholder="e.g., LeetCode, HackerRank"
              disabled={isSubmitting}
            />
            {errors.platform && <span className="error-message">{errors.platform}</span>}
          </div>
        </div>

        {/* URL Field */}
        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Problem URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className={`form-input ${errors.url ? 'error' : ''}`}
            placeholder="https://..."
            disabled={isSubmitting}
          />
          {errors.url && <span className="error-message">{errors.url}</span>}
        </div>

        {/* Last Reviewed and Next Review Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lastReviewed" className="form-label">
              Last Reviewed
            </label>
            <input
              type="date"
              id="lastReviewed"
              name="lastReviewed"
              value={formData.lastReviewed}
              onChange={handleChange}
              className={`form-input ${errors.lastReviewed ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.lastReviewed && <span className="error-message">{errors.lastReviewed}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nextReview" className="form-label">
              Next Review
            </label>
            <input
              type="date"
              id="nextReview"
              name="nextReview"
              value={formData.nextReview}
              onChange={handleChange}
              className={`form-input ${errors.nextReview ? 'error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.nextReview && <span className="error-message">{errors.nextReview}</span>}
          </div>
        </div>

        {/* Review Count Field */}
        <div className="form-group">
          <label htmlFor="reviewCount" className="form-label">
            Review Count
          </label>
          <input
            type="number"
            id="reviewCount"
            name="reviewCount"
            value={formData.reviewCount}
            onChange={handleChange}
            className={`form-input ${errors.reviewCount ? 'error' : ''}`}
            min="0"
            disabled={isSubmitting}
          />
          {errors.reviewCount && <span className="error-message">{errors.reviewCount}</span>}
        </div>

        {/* Notes Field */}
        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Add any additional notes..."
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Problem' : 'Create Problem'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProblemForm;
