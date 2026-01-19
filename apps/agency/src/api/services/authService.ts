/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import restClient from '../config/restClient';
import { executeGraphQL } from '../config/graphqlClient';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordInput,
  ChangePasswordResponse,
  UserState,
  ApiResponse,
  createApiError,
} from '../types';
import { CHANGE_PASSWORD_MUTATION } from '../queries';

const AUTH_ENDPOINTS = {
  LOGIN: '/agency/login',
  STATE: '/agency/state',
  SIGNUP: '/agency/signup',
  FORGOT_PASSWORD: '/agency/forgot-password',
  RESET_PASSWORD: '/agency/reset-password',
} as const;

/**
 * Login API (REST endpoint)
 * Note: Login is a REST endpoint, not GraphQL, so we use restClient
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await restClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  } catch (error: any) {
    // Convert to standardized ApiError
    throw createApiError(error);
  }
};

/**
 * Get User State API (REST endpoint)
 * Returns user + agency info
 */
export const getUserStateApi = async (): Promise<UserState> => {
  try {
    const response = await restClient.get<ApiResponse<UserState>>(AUTH_ENDPOINTS.STATE);
    
    // Check if response structure is correct
    if (!response || !response.data) {
      throw new Error('Invalid API response structure');
    }
    
    // Handle different response structures
    const userState = response.data.data || response.data;
    
    if (!userState || !userState.id || !userState.email) {
      throw new Error('Invalid user state data received');
    }
    
    return userState;
  } catch (error: any) {
    // If it's already an ApiError, re-throw it
    if (error instanceof Error && !error.message.includes('Invalid')) {
      throw createApiError(error);
    }
    // Otherwise, throw the validation error
    throw error;
  }
};

/**
 * Signup API (REST endpoint)
 */
export const signupApi = async (payload: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await restClient.post<SignupResponse>(AUTH_ENDPOINTS.SIGNUP, payload);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Forgot password API - send reset link
 */
export const forgotPasswordApi = async (
  payload: ForgotPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await restClient.post<ResetPasswordResponse>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Reset password API - requires reset token (sent via Authorization header)
 */
export const resetPasswordApi = async (
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const { token, password } = payload;
  try {
    const response = await restClient.post<ResetPasswordResponse>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      { password },
      token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : undefined
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Change password API (GraphQL mutation)
 */
export const changePasswordApi = async (
  input: ChangePasswordInput
): Promise<ChangePasswordResponse> => {
  try {
    const response = await executeGraphQL<{ changePassword: ChangePasswordResponse }>({
      operationName: 'ChangePassword',
      query: CHANGE_PASSWORD_MUTATION,
      variables: {
        input,
      },
    });

    return response.data.changePassword;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  loginApi,
  getUserStateApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
};

