// API configuration

// Base URLs for different environments
const getBaseUrl = () => {
  // Use Vite's environment variable for the backend URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Fallback for development
  return 'http://127.0.0.1:8000';
};

const API_BASE_URL = getBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Campaign endpoints
  CAMPAIGNS: `${API_BASE_URL}/api/campaigns/`,
  CREATE_CAMPAIGN: `${API_BASE_URL}/api/campaigns/create/`,
  
  // Analytics endpoints
  ANALYTICS_SUMMARY: `${API_BASE_URL}/api/email/analytics/summary/`,
  ANALYTICS_DEPARTMENT: `${API_BASE_URL}/api/email/analytics/department-performance/`,
  ANALYTICS_TREND: `${API_BASE_URL}/api/email/analytics/temporal-trend/`,
  
  // Course endpoints
  COURSES: `${API_BASE_URL}/get_courses_for_company/`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/get_users_for_company/`,
};

// Helper function to get authorization headers
export const getAuthHeaders = () => {
  // Check multiple possible token locations
  const token = 
    localStorage.getItem('access_token') || 
    localStorage.getItem('token') ||
    sessionStorage.getItem('access_token') ||
    sessionStorage.getItem('token');
    
  if (!token) {
    console.warn('No access token found in storage');
    console.log('Current localStorage:', { ...localStorage });
    console.log('Current sessionStorage:', { ...sessionStorage });
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export default API_ENDPOINTS;
