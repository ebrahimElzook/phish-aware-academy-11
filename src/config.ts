// API Configuration
// Determine if we're in production environment
const isProduction = window.location.hostname.includes('railway.app');

// Use absolute URL for production, relative path for development
export const API_BASE_URL = isProduction 
  ? 'https://phishaware-backend-production.up.railway.app/api'
  : '/api';

export const EMAIL_API_ENDPOINT = `${API_BASE_URL}/email/send/`;
export const EMAIL_SAVE_API_ENDPOINT = `${API_BASE_URL}/email/save/`;
export const EMAIL_CONFIGS_API_ENDPOINT = `${API_BASE_URL}/email/configurations/`;
export const EMAIL_TEMPLATES_API_ENDPOINT = `${API_BASE_URL}/email/templates/`;
export const EMAIL_SENT_API_ENDPOINT = `${API_BASE_URL}/email/sent-emails/`;
