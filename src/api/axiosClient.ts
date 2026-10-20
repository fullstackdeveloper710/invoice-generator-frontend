import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// ─── Environment & Config ────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT_MS = 15000;

/**
 * Pre-configured Axios instance for all frontend API communication.
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Allows easy expansion (e.g. adding auth tokens, request IDs)
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ────────────────────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => {
    // Normal 2xx responses pass through
    return response;
  },
  (error: AxiosError<{ message?: string; code?: string; details?: unknown }>) => {
    // Standardize and enrich error feedback
    let userMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server responded with non-2xx status code
      userMessage = error.response.data?.message || `Server error (${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response was received (network failure or server down)
      userMessage = 'Unable to connect to the server. Please ensure the backend is running.';
    } else if (error.message) {
      userMessage = error.message;
    }

    // Attach computed user-friendly message to the error object
    const enhancedError = Object.assign(error, { userMessage });

    return Promise.reject(enhancedError);
  },
);

export default axiosClient;
