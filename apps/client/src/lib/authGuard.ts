/**
 * Auth Guard Utility
 * Protects routes from authenticated users and validates tokens
 * NOTE: Use AuthContext instead of calling APIs directly to prevent duplicates
 */

import { getAuthToken } from './auth';
import { getAuthStateApi } from '../api/services/authService';
import { getCurrentUserApi } from '../api/services/profileService';

/**
 * Check if user is authenticated and validate token
 * Calls both state API and currentUser API for validation
 * DEPRECATED: Use AuthContext instead to prevent duplicate API calls
 * Returns user state if valid, null if invalid/not authenticated
 */
export const validateAuth = async (): Promise<{
  userState: any;
  currentUser: any;
} | null> => {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthGuard] Validating token - calling state and currentUser APIs...');
    }

    // Call both APIs in parallel for validation (as per requirement)
    const [userState, currentUser] = await Promise.all([
      getAuthStateApi(),
      getCurrentUserApi(),
    ]);

    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthGuard] Token validated successfully', {
        userId: currentUser?.id || userState?.id,
        hasBio: !!userState?.bio,
        hasOnboarding: !!userState?.onboarding,
      });
    }

    // Store user data in localStorage for header display
    if (typeof window !== 'undefined' && currentUser) {
      localStorage.setItem('auth-user', JSON.stringify({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.bio?.username || currentUser.name,
        imageURL: currentUser.bio?.imageURL || null,
      }));
    }

    return { userState, currentUser };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AuthGuard] Token validation failed:', error);
    }
    // Clear invalid token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-user');
    }
    return null;
  }
};

/**
 * Redirect authenticated users away from auth pages
 * Should be called on login/signup/onboarding/landing pages
 * Uses AuthContext to prevent duplicate API calls
 * Returns: { shouldRedirect: boolean, isLoading: boolean }
 */
export const redirectIfAuthenticated = async (
  router: any,
  authContext?: { userState: any; currentUser: any; isAuthenticated: boolean; isLoading: boolean }
): Promise<{
  shouldRedirect: boolean;
  isLoading: boolean;
}> => {
  // If auth context is provided, use it (prevents duplicate API calls)
  if (authContext) {
    if (authContext.isLoading) {
      return { shouldRedirect: false, isLoading: true };
    }

    if (!authContext.isAuthenticated) {
      return { shouldRedirect: false, isLoading: false };
    }

    const { userState } = authContext;
    
    // Redirect based on user state
    if (userState?.onboarding) {
      router.push('/onboarding');
      return { shouldRedirect: true, isLoading: false };
    } else if (userState?.bio) {
      router.push('/creator/myPage');
      return { shouldRedirect: true, isLoading: false };
    } else {
      router.push('/onboarding');
      return { shouldRedirect: true, isLoading: false };
    }
  }

  // Fallback: check token directly (for pages that don't have AuthContext yet)
  const token = getAuthToken();
  
  // No token = not authenticated, allow access to public routes
  if (!token) {
    return { shouldRedirect: false, isLoading: false };
  }

  // Token exists, validate it (this will call APIs - try to avoid this)
  try {
    const authData = await validateAuth();
    
    if (authData) {
      const { userState } = authData;
      
      // Redirect based on user state
      if (userState.onboarding) {
        router.push('/onboarding');
        return { shouldRedirect: true, isLoading: false };
      } else if (userState.bio) {
        router.push('/creator/myPage');
        return { shouldRedirect: true, isLoading: false };
      } else {
        router.push('/onboarding');
        return { shouldRedirect: true, isLoading: false };
      }
    }
    
    // Token invalid, allow access to public routes
    return { shouldRedirect: false, isLoading: false };
  } catch (error) {
    // Error during validation, allow access
    return { shouldRedirect: false, isLoading: false };
  }
};

