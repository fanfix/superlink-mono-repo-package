/**
 * useAuthApi Hook
 * Provides access to authentication API functions
 */

import { useApiCall } from './useApiCall';
import {
  loginApi,
  createAccessTokenApi,
  createAgencyAccessTokenApi,
  forgotPasswordApi,
  resetPasswordApi,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../api/services/authService';
import { LoginResponse } from '../api/types';

export const useAuthApi = () => {
  const login = useApiCall<LoginResponse, [LoginRequest]>(loginApi);
  const createAccessToken = useApiCall(createAccessTokenApi);
  const createAgencyAccessToken = useApiCall(createAgencyAccessTokenApi);
  const forgotPassword = useApiCall<{ message: string }, [ForgotPasswordRequest]>(forgotPasswordApi);
  const resetPassword = useApiCall<{ message: string }, [ResetPasswordRequest]>(resetPasswordApi);

  return {
    login,
    createAccessToken,
    createAgencyAccessToken,
    forgotPassword,
    resetPassword,
  };
};

export type {
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
};

