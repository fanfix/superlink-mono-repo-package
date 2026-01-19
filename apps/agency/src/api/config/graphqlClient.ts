/**
 * GraphQL Client Configuration
 * Handles GraphQL requests with authentication
 */

import axios, { AxiosInstance } from 'axios';
import { getAuthToken } from '../../lib/auth';
import { createApiError } from '../types';

const GRAPHQL_ENDPOINT = 'https://api.superlink.io/graphql';

/**
 * Create GraphQL client instance
 */
export const graphqlClient: AxiosInstance = axios.create({
  baseURL: GRAPHQL_ENDPOINT,

  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add auth token to headers
 */
graphqlClient.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Request:', {
        url: config.url,
        method: config.method,
        operationName: config.data?.operationName,
        hasToken: !!token,
      });
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Log responses
 */
graphqlClient.interceptors.response.use(
  (response: any) => {
    // Log successful response for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Response Success:', {
        url: response.config?.url,
        status: response.status,
        operationName: response.config?.data?.operationName,
      });
    }
    return response;
  },
  (error: any) => {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('GraphQL Response Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        operationName: error.config?.data?.operationName,
      });
    }
    return Promise.reject(error);
  }
);

/**
 * Execute GraphQL query/mutation
 */
export interface GraphQLRequest {
  operationName: string;
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

/**
 * Execute GraphQL request
 */
export async function executeGraphQL<T = any>(
  request: GraphQLRequest
): Promise<GraphQLResponse<T>> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Execute:', {
        operationName: request.operationName,
        variables: request.variables,
      });
    }
    
    const response = await graphqlClient.post<GraphQLResponse<T>>('', request);
    
    const normaliseGraphQLErrors = (rawErrors: GraphQLResponse['errors']) => {
      if (!rawErrors) return [];
      if (Array.isArray(rawErrors)) {
        return rawErrors.filter(Boolean);
      }
      if (typeof rawErrors === 'object') {
        const values = Object.values(rawErrors).flat();
        return values.filter((value): value is { message?: string; extensions?: Record<string, any> } => {
          return value !== null && typeof value === 'object';
        });
      }
      return [];
    };
    
    const graphQLErrors = normaliseGraphQLErrors(response.data?.errors);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Response:', {
        operationName: request.operationName,
        hasData: !!response.data,
        hasDataData: !!response.data?.data,
        hasErrors: graphQLErrors.length > 0,
        responseDataType: typeof response.data,
        rawErrors: response.data?.errors,
      });
    }
    
    // Check for GraphQL errors in response
    if (graphQLErrors.length > 0) {
      const graphqlError = graphQLErrors[0] ?? {};
      const errorMessage =
        (typeof graphqlError.message === 'string' && graphqlError.message.trim().length > 0
          ? graphqlError.message
          : `GraphQL error occurred (${request.operationName})`);
      const errorDetails = {
        message: errorMessage,
        extensions: graphqlError.extensions,
        errors: graphQLErrors,
        rawErrors: response.data?.errors,
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL Response Errors:', {
          operationName: request.operationName,
          errors: graphQLErrors,
          errorDetails,
        });
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response has data
    // GraphQL response structure: { data: { getRecentActivities: [...] }, errors: [...] }
    // So response.data.data contains the actual data
    if (!response || !response.data) {
      const errorMessage = 'GraphQL response missing';
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL Response Missing:', {
          operationName: request.operationName,
          response: response,
        });
      }
      throw new Error(errorMessage);
    }
    
    // GraphQL response structure has data property
    // If response.data.data exists, use it; otherwise use response.data (for services that directly access properties)
    return response.data;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('GraphQL Error:', {
        operationName: request.operationName,
        error: error,
        errorMessage: error?.message,
        errorResponse: error?.response?.data,
        errorStatus: error?.response?.status,
        errorStack: error?.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
    }
    
    // Convert to standardized ApiError
    throw createApiError(error);
  }
}

export default graphqlClient;

