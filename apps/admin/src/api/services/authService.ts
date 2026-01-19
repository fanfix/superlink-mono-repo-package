/**
 * Authentication Service for Admin Panel
 * Handles all authentication-related API calls
 */

import restClient from '../config/restClient';
import { LoginRequest, LoginResponse, createApiError } from '../types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/admin/login',
  CREATE_ACCESS_TOKEN: '/auth/create-access-token',
  CREATE_ACCESS_TOKEN_AGENCY: '/auth/create-access-token-agency',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

/**
 * Admin Login API (REST endpoint)
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await restClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Create Access Token API
 */
export const createAccessTokenApi = async (): Promise<{ accessToken: string }> => {
  try {
    const response = await restClient.post<{ accessToken: string }>(AUTH_ENDPOINTS.CREATE_ACCESS_TOKEN);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Create Agency Access Token API
 */
export const createAgencyAccessTokenApi = async (): Promise<{ accessToken: string }> => {
  try {
    const response = await restClient.post<{ accessToken: string }>(AUTH_ENDPOINTS.CREATE_ACCESS_TOKEN_AGENCY);
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Forgot password API - send reset link
 */
export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPasswordApi = async (
  payload: ForgotPasswordRequest
): Promise<{ message: string }> => {
  try {
    const response = await restClient.post<{ message: string }>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Reset password API
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const resetPasswordApi = async (
  payload: ResetPasswordRequest
): Promise<{ message: string }> => {
  try {
    const response = await restClient.post<{ message: string }>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  loginApi,
  createAccessTokenApi,
  createAgencyAccessTokenApi,
  forgotPasswordApi,
  resetPasswordApi,
};

