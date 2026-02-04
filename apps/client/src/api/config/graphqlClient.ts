/**
 * GraphQL Client Configuration
 * Handles GraphQL requests with authentication for Client App
 */

import axios, { AxiosInstance } from 'axios';
import { getAuthToken } from '../../lib/auth';
import { createApiError } from '../types';

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://develop-service-v2.superlink.io/graphql';
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
    return response;
  },
  (error: any) => {
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
    const response = await graphqlClient.post<GraphQLResponse<T>>('', request);
    
    const isNonEmptyObject = (value: unknown): value is Record<string, any> => {
      return !!value && typeof value === 'object' && Object.keys(value as any).length > 0;
    };

    const normaliseGraphQLErrors = (rawErrors: GraphQLResponse['errors']) => {
      if (!rawErrors) return [];
      if (Array.isArray(rawErrors)) {
        return rawErrors.filter((err) => isNonEmptyObject(err));
      }
      if (typeof rawErrors === 'object') {
        const values = Object.values(rawErrors).flat();
        return values.filter((value): value is { message?: string; extensions?: Record<string, any> } => {
          return isNonEmptyObject(value);
        });
      }
      return [];
    };
    
    const graphQLErrors = normaliseGraphQLErrors(response?.data?.errors);
    
    // Check for GraphQL errors in response
    if (graphQLErrors.length > 0) {
      const graphqlError = graphQLErrors[0] ?? {};
      const messageFromError =
        typeof (graphqlError as any)?.message === 'string' ? (graphqlError as any).message.trim() : '';
      const errorMessage = messageFromError.length > 0
        ? messageFromError
        : isNonEmptyObject(graphqlError)
          ? `GraphQL error occurred (${request.operationName}): ${JSON.stringify(graphqlError)}`
          : `GraphQL error occurred (${request.operationName})`;
      const errorDetails = {
        message: errorMessage,
        extensions: (graphqlError as any).extensions,
        errors: graphQLErrors,
        rawErrors: response.data?.errors,
      };
      
      throw new Error(errorMessage);
    }
    
    // Check if response has data
    // GraphQL response structure: { data: { getRecentActivities: [...] }, errors: [...] }
    // So response.data.data contains the actual data
    if (!response || !response.data) {
      const errorMessage = 'GraphQL response missing';
      throw new Error(errorMessage);
    }
    
    // GraphQL response structure has data property
    // If response.data.data exists, use it; otherwise use response.data (for services that directly access properties)
    return response.data;
  } catch (error: any) {
    // Convert to standardized ApiError
    throw createApiError(error);
  }
}

export default graphqlClient;

