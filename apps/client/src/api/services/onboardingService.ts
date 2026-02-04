/**
 * Onboarding Service
 * Handles onboarding-related API calls (GraphQL + REST)
 */

import restClient from '../config/restClient';
import { executeGraphQL } from '../config/graphqlClient';
import {
  CHECK_IF_PHONE_AND_EMAIL_EXISTS_QUERY,
  ONBOARD_USER_MUTATION,
} from '../queries';
import type {
  CheckIfPhoneAndEmailExistsResult,
  OnboardUserInput,
  OnboardUserResult,
  UsernameAvailabilityResponse,
} from '../types';
import { createApiError } from '../types';

/**
 * Check if phone and email already exists (GraphQL)
 */
export async function checkIfPhoneAndEmailExistsApi(params: {
  email: string;
  phone: string;
}): Promise<CheckIfPhoneAndEmailExistsResult> {
  try {
    const response = await executeGraphQL<{ checkIfPhoneAndEmailExists: unknown }>({
      operationName: 'Query',
      query: CHECK_IF_PHONE_AND_EMAIL_EXISTS_QUERY,
      variables: { email: params.email, phone: params.phone },
    });

    const raw = response.data.checkIfPhoneAndEmailExists as any;
    const message =
      typeof raw === 'string'
        ? raw
        : raw && typeof raw === 'object' && typeof raw.message === 'string'
          ? raw.message
          : typeof raw === 'boolean'
            ? (raw ? 'OK' : 'NOT_OK')
            : '';

    if (!message) {
      throw new Error('Invalid checkIfPhoneAndEmailExists response');
    }

    return { message };
  } catch (error: any) {
    throw createApiError(error);
  }
}

/**
 * Username availability check (REST)
 * Backend response expected: { available: true|false }
 */
export async function checkUsernameAvailabilityApi(
  username: string
): Promise<UsernameAvailabilityResponse> {
  try {
    const safeUsername = encodeURIComponent(username.trim());
    const response = await restClient.get<any>(`/users/check-username-availability/${safeUsername}`);

    const data = response?.data;
    if (data && typeof data === 'object') {
      if (typeof data.available === 'boolean') return { available: data.available };
      if (data.data && typeof data.data.available === 'boolean') return { available: data.data.available };
    }

    // Fallback: if backend returns plain boolean
    if (typeof data === 'boolean') return { available: data };

    throw new Error('Invalid username availability response');
  } catch (error: any) {
    throw createApiError(error);
  }
}

/**
 * Onboard user (GraphQL mutation)
 */
export async function onboardUserApi(onboardUserInput: OnboardUserInput): Promise<OnboardUserResult> {
  try {
    const response = await executeGraphQL<{ onboardUser: OnboardUserResult }>({
      operationName: 'OnboardUser',
      query: ONBOARD_USER_MUTATION,
      variables: { onboardUserInput },
    });

    return response.data.onboardUser;
  } catch (error: any) {
    throw createApiError(error);
  }
}

