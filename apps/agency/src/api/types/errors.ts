/**
 * API Error Types
 * Standardized error types for consistent error handling across the application
 */

export enum ApiErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiErrorDetails {
  code?: string;
  field?: string;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode?: number;
  public readonly details?: ApiErrorDetails;
  public readonly originalError?: any;

  constructor(
    message: string,
    code: ApiErrorCode = ApiErrorCode.UNKNOWN_ERROR,
    statusCode?: number,
    details?: ApiErrorDetails,
    originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return this.code === ApiErrorCode.NETWORK_ERROR;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.code === ApiErrorCode.UNAUTHORIZED || this.statusCode === 401;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 500;
  }
}

/**
 * Create ApiError from axios error
 */
export function createApiError(error: any): ApiError {
  // Network error (no response received)
  if (!error.response && error.request) {
    if (error.code === 'ERR_NETWORK') {
      return new ApiError(
        'Network error. Please check your internet connection.',
        ApiErrorCode.NETWORK_ERROR,
        undefined,
        { code: error.code },
        error
      );
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new ApiError(
        'Request timeout. Please try again.',
        ApiErrorCode.TIMEOUT_ERROR,
        undefined,
        { code: error.code },
        error
      );
    }
    return new ApiError(
      'Unable to connect to server. Please try again later.',
      ApiErrorCode.NETWORK_ERROR,
      undefined,
      { code: error.code },
      error
    );
  }

  // Server responded with error status
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data || {};
    const message = data.message || data.error || error.message || `Request failed with status ${status}`;

    let code = ApiErrorCode.UNKNOWN_ERROR;
    if (status === 401) code = ApiErrorCode.UNAUTHORIZED;
    else if (status === 403) code = ApiErrorCode.FORBIDDEN;
    else if (status === 404) code = ApiErrorCode.NOT_FOUND;
    else if (status >= 500) code = ApiErrorCode.SERVER_ERROR;
    else if (status >= 400) code = ApiErrorCode.VALIDATION_ERROR;

    return new ApiError(
      message,
      code,
      status,
      { ...data, status },
      error
    );
  }

  // GraphQL errors
  if (error.response?.data?.errors) {
    const gqlError = error.response.data.errors[0];
    return new ApiError(
      gqlError.message || 'GraphQL request failed',
      ApiErrorCode.VALIDATION_ERROR,
      error.response?.status,
      gqlError.extensions,
      error
    );
  }

  // Unknown error
  return new ApiError(
    error.message || 'An unexpected error occurred.',
    ApiErrorCode.UNKNOWN_ERROR,
    undefined,
    undefined,
    error
  );
}

