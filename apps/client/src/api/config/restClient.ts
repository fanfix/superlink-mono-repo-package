/**
 * REST Client for non-GraphQL endpoints
 * Used for authentication and other REST endpoints for Client App
 */

import axios from 'axios';
import { getAuthToken, clearAuth } from '../../lib/auth';
import { createApiError } from '../types';

const REST_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://develop-service-v2.superlink.io';
/**
 * Create REST client instance
 */
export const restClient = axios.create({
  baseURL: REST_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add auth token to headers
 */
restClient.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken();
    
    // Only add token if it exists (login/signup doesn't need token)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
restClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Convert to standardized ApiError before rejecting
    const apiError = createApiError(error);
    return Promise.reject(apiError);
  }
);

export default restClient;

