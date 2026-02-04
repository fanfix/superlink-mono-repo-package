/**
 * Authentication Service
 * Handles all authentication-related API calls for Client App
 */

import restClient from '../config/restClient';
import { executeGraphQL } from '../config/graphqlClient';
import { clearAuth } from '../../lib/auth';
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
  SendOTPRequest,
  SendOTPResponse,
  OTPLoginRequest,
  OTPLoginResponse,
  createApiError,
} from '../types';
import { CHANGE_PASSWORD_MUTATION } from '../queries';

const AUTH_ENDPOINTS = {
  LOGIN: '/client/login',
  STATE: '/client/state',
  AUTH_STATE: '/auth/state',
  SIGNUP: '/client/signup',
  FORGOT_PASSWORD: '/client/forgot-password',
  RESET_PASSWORD: '/client/reset-password',
  SEND_OTP: '/auth/send-otp',
  OTP_LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
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
 * Returns user + bio info
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

/**
 * Send OTP API (REST endpoint)
 * Sends OTP to phone number for login
 */
export const sendOTPApi = async (payload: SendOTPRequest): Promise<SendOTPResponse> => {
  try {
    const response = await restClient.post<SendOTPResponse>(AUTH_ENDPOINTS.SEND_OTP, payload);

    // Check if response has error statusCode in body (backend returns 200 with error in body)
    if (response.data && typeof response.data === 'object') {
      const responseData = response.data as any;
      
      // Check if response contains error statusCode
      if (responseData.statusCode && responseData.statusCode !== 200 && responseData.statusCode >= 400) {
        const errorMessage = responseData.message || 'Request failed';
        // Create error object that matches ApiError structure
        const error = new Error(errorMessage);
        (error as any).response = {
          status: responseData.statusCode,
          data: responseData
        };
        throw error;
      }
      
      // If response.data is the SendOTPResponse object directly
      if ('message' in responseData) {
        return responseData as SendOTPResponse;
      }
      
      // If response.data contains nested data
      if (responseData.data && typeof responseData.data === 'object') {
        return responseData.data as SendOTPResponse;
      }
    }

    // If response.data is just a string message
    if (typeof response.data === 'string') {
      return { message: response.data };
    }

    // Return default success message if structure is unexpected
    return { message: 'OTP sent successfully' };
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * OTP Login API (REST endpoint)
 * Login with phone number and OTP code
 */
export const otpLoginApi = async (credentials: OTPLoginRequest): Promise<OTPLoginResponse> => {
  try {
    const response = await restClient.post<OTPLoginResponse>(AUTH_ENDPOINTS.OTP_LOGIN, credentials);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Auth State API (REST endpoint)
 * Returns user + bio info from /auth/state endpoint
 * This is an alternative to /client/state endpoint
 * Compatible with superlink-main getAuthState behavior
 */
export const getAuthStateApi = async (accessToken?: string): Promise<UserState> => {
  try {
    // If accessToken is provided, use it; otherwise restClient interceptor will use getAuthToken()
    const config = accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined;

    const response = await restClient.get<UserState>(AUTH_ENDPOINTS.AUTH_STATE, config);
    
    // Check if response structure is correct
    if (!response || !response.data) {
      throw new Error('Invalid API response structure');
    }
    
    // Handle different response structures
    const userState = response.data;
    
    if (!userState || !userState.id) {
      throw new Error('Invalid user state data received');
    }
    return userState;
  } catch (error: any) {
    // Handle 401 Unauthorized - clear auth (same as superlink-main)
    if (error.response?.status === 401) {
      clearAuth();
    }
    
    // If it's already an ApiError, re-throw it
    if (error instanceof Error && !error.message.includes('Invalid')) {
      throw createApiError(error);
    }
    // Otherwise, throw the validation error
    throw error;
  }
};

/**
 * Logout API (REST endpoint)
 * Logs out the user and clears server-side session
 * Compatible with superlink-main logout behavior
 */
export const logoutApi = async (): Promise<void> => {
  try {
    await restClient.post(AUTH_ENDPOINTS.LOGOUT, {});
  } catch (error: any) {
    // Even if logout API fails, we should clear local auth
    // This matches superlink-main behavior
  } finally {
    // Always clear local auth regardless of API response
    clearAuth();
  }
};

export default {
  loginApi,
  getUserStateApi,
  getAuthStateApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
  sendOTPApi,
  otpLoginApi,
  logoutApi,
};

