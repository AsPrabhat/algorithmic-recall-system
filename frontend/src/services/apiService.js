// API Service for Backend Communication
// Base URL for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/problems')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data or throws error
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData || response.statusText}`);
    }

    // Handle 204 No Content (e.g., from DELETE)
    if (response.status === 204) {
      return null;
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// PROBLEM API ENDPOINTS
// ============================================

/**
 * Get all problems
 * @returns {Promise<Array>} List of all problems
 */
export async function getAllProblems() {
  return apiFetch('/problems');
}

/**
 * Get a single problem by ID
 * @param {number} id - Problem ID
 * @returns {Promise<Object>} Problem data
 */
export async function getProblemById(id) {
  return apiFetch(`/problems/${id}`);
}

/**
 * Create a new problem
 * @param {Object} problemData - Problem data to create
 * @returns {Promise<Object>} Created problem with ID
 */
export async function createProblem(problemData) {
  return apiFetch('/problems', {
    method: 'POST',
    body: JSON.stringify(problemData),
  });
}

/**
 * Update an existing problem
 * @param {number} id - Problem ID
 * @param {Object} problemData - Updated problem data
 * @returns {Promise<Object>} Updated problem
 */
export async function updateProblem(id, problemData) {
  return apiFetch(`/problems/${id}`, {
    method: 'PUT',
    body: JSON.stringify(problemData),
  });
}

/**
 * Delete a problem
 * @param {number} id - Problem ID
 * @returns {Promise<null>} Returns null on success
 */
export async function deleteProblem(id) {
  return apiFetch(`/problems/${id}`, {
    method: 'DELETE',
  });
}

// ============================================
// TEST ENDPOINT
// ============================================

/**
 * Test backend connection
 * @returns {Promise<string>} Hello message from backend
 */
export async function testConnection() {
  const url = `${API_BASE_URL}/hello`;
  const response = await fetch(url);
  return response.text();
}

// Export base URL for reference
export { API_BASE_URL };
