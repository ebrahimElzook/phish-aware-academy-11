// API Configuration
// Using relative path since we're using Vite proxy
const API_BASE_PATH = '/api';

export const EMAIL_API_ENDPOINT = `${API_BASE_PATH}/email/send/`;
export const EMAIL_SAVE_API_ENDPOINT = `${API_BASE_PATH}/email/save/`;
export const EMAIL_CONFIGS_API_ENDPOINT = `${API_BASE_PATH}/email/configurations/`;
export const EMAIL_TEMPLATES_API_ENDPOINT = `${API_BASE_PATH}/email/templates/`;
