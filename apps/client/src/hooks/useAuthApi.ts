/**
 * Authentication API Hook
 * Custom hook for authentication-related API calls
 */

import { useApiCall } from './useApiCall';
import {
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
} from '../api/services/authService';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ResetPasswordResponse,
  ResetPasswordRequest,
  ChangePasswordInput,
  ChangePasswordResponse,
  UserState,
  SendOTPRequest,
  SendOTPResponse,
  OTPLoginRequest,
  OTPLoginResponse,
} from '../api/types';

/**
 * Hook for login API
 */
export const useLogin = () => {
  return useApiCall<LoginResponse, [LoginRequest]>(loginApi);
};

/**
 * Hook for get user state API
 */
export const useGetUserState = () => {
  return useApiCall<UserState, []>(getUserStateApi);
};

/**
 * Hook for signup API
 */
export const useSignup = () => {
  return useApiCall<SignupResponse, [SignupRequest]>(signupApi);
};

/**
 * Hook for forgot password API
 */
export const useForgotPassword = () => {
  return useApiCall<ResetPasswordResponse, [ForgotPasswordRequest]>(forgotPasswordApi);
};

/**
 * Hook for reset password API
 */
export const useResetPassword = () => {
  return useApiCall<ResetPasswordResponse, [ResetPasswordRequest]>(resetPasswordApi);
};

/**
 * Hook for change password API
 */
export const useChangePassword = () => {
  return useApiCall<ChangePasswordResponse, [ChangePasswordInput]>(changePasswordApi);
};

/**
 * Hook for send OTP API
 */
export const useSendOTP = () => {
  return useApiCall<SendOTPResponse, [SendOTPRequest]>(sendOTPApi);
};

/**
 * Hook for OTP login API
 */
export const useOTPLogin = () => {
  return useApiCall<OTPLoginResponse, [OTPLoginRequest]>(otpLoginApi);
};

/**
 * Hook for get auth state API (from /auth/state endpoint)
 */
export const useGetAuthState = () => {
  return useApiCall<UserState, []>(getAuthStateApi);
};

/**
 * Hook for logout API
 */
export const useLogout = () => {
  return useApiCall<void, []>(logoutApi);
};

