import axios, { type AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
export const USE_MOCKS = String(import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  config.headers['X-RootPilot-Client'] = 'frontend-v1';
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url ?? 'unknown';
    
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login only if not already on the login page to prevent loops
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    if (!error.response) {
      console.error(`[RootPilot] Network error — backend unreachable. Check that Spring Boot is running on ${API_BASE_URL}. Endpoint: ${url}`);
    } else if (status === 500) {
      console.error(`[RootPilot] Server error (500) on ${url}:`, error.response.data);
    } else {
      console.error(`[RootPilot] API error (${status}) on ${url}`);
    }
    return Promise.reject(error);
  },
);
