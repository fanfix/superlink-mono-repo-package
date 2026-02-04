/**
 * Onboarding API Hooks
 */

import { useApiCall } from './useApiCall';
import {
  checkIfPhoneAndEmailExistsApi,
  checkUsernameAvailabilityApi,
  onboardUserApi,
} from '../api/services/onboardingService';
import type {
  CheckIfPhoneAndEmailExistsResult,
  UsernameAvailabilityResponse,
  OnboardUserInput,
  OnboardUserResult,
} from '../api/types';

export const useCheckIfPhoneAndEmailExists = () => {
  return useApiCall<CheckIfPhoneAndEmailExistsResult, [{ email: string; phone: string }]>(checkIfPhoneAndEmailExistsApi);
};

export const useCheckUsernameAvailability = () => {
  return useApiCall<UsernameAvailabilityResponse, [string]>(checkUsernameAvailabilityApi);
};

export const useOnboardUser = () => {
  return useApiCall<OnboardUserResult, [OnboardUserInput]>(onboardUserApi);
};

