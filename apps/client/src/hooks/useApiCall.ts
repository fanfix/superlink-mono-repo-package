/**
 * Base Hook for API Calls
 * Provides a reusable pattern for API calls with loading and error states
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError, createApiError } from '../api/types';

export interface UseApiCallOptions {
  /** Whether to throw errors or return them */
  throwOnError?: boolean;
  /** Custom error handler */
  onError?: (error: ApiError) => void;
  /** Custom success handler */
  onSuccess?: <T>(data: T) => void;
}

export interface UseApiCallReturn<TData, TParams extends any[] = any[]> {
  /** Execute the API call */
  execute: (...params: TParams) => Promise<TData | undefined>;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Clear error */
  clearError: () => void;
  /** Data from last successful call */
  data: TData | null;
}

/**
 * Custom hook for API calls with loading and error handling
 * 
 * @example
 * const { execute, loading, error } = useApiCall(getUserData);
 * const user = await execute(userId);
 */
export function useApiCall<TData, TParams extends any[] = any[]>(
  apiFunction: (...params: TParams) => Promise<TData>,
  options: UseApiCallOptions = {}
): UseApiCallReturn<TData, TParams> {
  const { throwOnError = true, onError, onSuccess } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TData | null>(null);
  
  // Use ref to store the latest apiFunction to avoid stale closures
  const apiFunctionRef = useRef(apiFunction);
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);
  
  // Update refs when they change
  useEffect(() => {
    apiFunctionRef.current = apiFunction;
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [apiFunction, onError, onSuccess]);

  const execute = useCallback(
    async (...params: TParams): Promise<TData | undefined> => {
      const currentApiFunction = apiFunctionRef.current;
      setLoading(true);
      setError(null);

      try {
        const result = await currentApiFunction(...params);
        setData(result);
        
        if (onSuccessRef.current) {
          onSuccessRef.current(result);
        }
        
        return result;
      } catch (err: any) {
        // Create ApiError if not already one
        const apiError = err instanceof ApiError ? err : createApiError(err);
        setError(apiError);

        if (onErrorRef.current) {
          onErrorRef.current(apiError);
        }

        if (throwOnError) {
          throw apiError;
        }

        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [throwOnError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    clearError,
    data,
  };
}

/**
 * Hook for multiple API calls with individual loading states
 * 
 * @example
 * const api = useMultipleApiCalls({
 *   fetchUsers: getUserData,
 *   fetchPosts: getPostData,
 * });
 * 
 * const users = await api.fetchUsers.execute();
 * // api.fetchUsers.loading, api.fetchUsers.error available
 */
export function useMultipleApiCalls<
  TApiMap extends Record<string, (...args: any[]) => Promise<any>>
>(apiMap: TApiMap): {
  [K in keyof TApiMap]: UseApiCallReturn<
    Awaited<ReturnType<TApiMap[K]>>,
    Parameters<TApiMap[K]>
  >;
} {
  const result = {} as any;

  for (const [key, apiFunction] of Object.entries(apiMap)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[key] = useApiCall(apiFunction);
  }

  return result;
}

