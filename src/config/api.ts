// API configuration

// Base URLs for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://phishaware-backend-production.up.railway.app'
  : 'http://127.0.0.1:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Campaign endpoints
  CAMPAIGNS: `${API_BASE_URL}/api/campaigns/`,
  CREATE_CAMPAIGN: `${API_BASE_URL}/api/campaigns/create/`,
  
  // Course endpoints
  COURSES: `${API_BASE_URL}/get_courses_for_company/`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/get_users_for_company/`,
  
  // Add other endpoints as needed
};

// Helper function to get authorization headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export default API_ENDPOINTS;
