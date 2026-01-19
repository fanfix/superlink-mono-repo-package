'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, 
  getAuthToken, 
  setAuthToken, 
  getUser, 
  setUser, 
  getAgencyId,
  setAgencyId as setAgencyIdStorage,
  clearAuth, 
  isAuthenticated as checkIsAuthenticated, 
  setRedirectPath 
} from '../lib/auth';
import { ROUTES, isPublicRoute } from '../config/routes';
import {
  loginApi,
  getUserStateApi,
  signupApi,
  forgotPasswordApi,
  resetPasswordApi,
  changePasswordApi,
} from '../api/services/authService';
import type { AgencyInfo } from '../api/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  agencyId: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token?: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  fetchUserState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Fetch user state from API and store in localStorage
   */
  const fetchUserState = useCallback(async () => {
    try {
      const userState = await getUserStateApi();
      
      // Validate user state
      if (!userState?.id || !userState?.email) {
        throw new Error('Invalid user state received from API');
      }
      
      const normalizedAgency: AgencyInfo | null = userState.agency
        ? {
            id: userState.agency.id,
            name: userState.agency.name ?? null,
            email: userState.agency.email ?? null,
            phoneNumber: userState.agency.phoneNumber ?? null,
            imageURL: userState.agency.imageURL ?? null,
            website: userState.agency.website ?? null,
            displayAgencyBranding: userState.agency.displayAgencyBranding ?? null,
            street: userState.agency.street ?? null,
            city: userState.agency.city ?? null,
            state: userState.agency.state ?? null,
            zip: (userState.agency as any).zip ?? null,
            postalCode: userState.agency.postalCode ?? (userState.agency as any).zip ?? null,
            country: userState.agency.country ?? null,
            landmark: userState.agency.landmark ?? null,
            address: {
              street: userState.agency.street ?? userState.agency.address?.street ?? null,
              city: userState.agency.city ?? userState.agency.address?.city ?? null,
              state: userState.agency.state ?? userState.agency.address?.state ?? null,
              postalCode:
                userState.agency.postalCode ??
                (userState.agency as any).zip ??
                userState.agency.address?.postalCode ??
                userState.agency.address?.zipCode ??
                null,
              zipCode:
                userState.agency.address?.zipCode ??
                userState.agency.address?.postalCode ??
                (userState.agency as any).zip ??
                null,
              country: userState.agency.country ?? userState.agency.address?.country ?? null,
              landmark: userState.agency.landmark ?? userState.agency.address?.landmark ?? null,
            },
          }
        : null;

      const agencyIdValue = userState.agencyId || normalizedAgency?.id || null;

      const userData: User = {
        id: userState.id,
        email: userState.email,
        name: userState.name || userState.email.split('@')[0],
        phone: userState.phone || userState.phoneNumber || null,
        phoneNumber: userState.phoneNumber || userState.phone || null,
        avatar: userState.avatar ?? null,
        imageURL: userState.imageURL ?? null,
        agencyId: agencyIdValue,
        agency: normalizedAgency,
      };
      
      // Store in localStorage for persistence
      setUser(userData);
      setUserState(userData);
      
      // Extract agencyId - can be from agencyId or agency.id
      console.log('AuthContext: State API response:', {
        userState,
        agencyIdFromState: userState.agencyId,
        agencyIdFromAgency: userState.agency?.id,
        finalAgencyId: agencyIdValue,
      });
      
      // Set agencyId - this will trigger dashboard APIs automatically
      if (agencyIdValue) {
        console.log('AuthContext: ✅ State API completed, setting agencyId:', agencyIdValue);
        setAgencyId(agencyIdValue);
        setAgencyIdStorage(agencyIdValue);
        console.log('AuthContext: agencyId set in state and localStorage');
      } else {
        console.warn('AuthContext: ⚠️ State API completed but no agencyId received');
        console.warn('AuthContext: userState:', userState);
        setAgencyId(null);
      }
    } catch (error: any) {
      // If API fails, clear auth only if it's a critical error
      // Don't clear on network errors - user might still be valid
      if (error instanceof Error && error.message.includes('Network')) {
        // Network error - keep cached data
        console.warn('Network error fetching user state, keeping cached data');
      } else {
        // Critical error - clear auth
        clearAuth();
        setUserState(null);
        setAgencyId(null);
      }
      throw error;
    }
  }, []);

  /**
   * Check authentication status and load user data
   */
  const checkAuth = useCallback(async () => {
    try {
      const token = getAuthToken();
      const userData = getUser();
      const storedAgencyId = getAgencyId();
      
      if (token) {
        // If we have user data in localStorage, use it initially
        if (userData) {
          setUserState(userData);
          // Also set agencyId if available
          if (storedAgencyId || userData.agencyId) {
            setAgencyId(storedAgencyId ?? userData.agencyId ?? null);
          }
        }
        
        // Always fetch from API to get latest data (including agencyId)
        // This ensures we have the latest information and validates the token
        // After this completes, dashboard APIs will automatically trigger
        try {
          console.log('AuthContext: Fetching user state from API...');
          await fetchUserState();
          console.log('AuthContext: ✅ User state fetched successfully, dashboard APIs should trigger now');
        } catch (fetchError) {
          // If fetch fails but we have cached data, still use it
          console.warn('AuthContext: Failed to fetch user state, using cached data:', fetchError);
          // Don't clear auth if we have cached data - user might still be valid
        }
      } else {
        // No token, clear everything
        setUserState(null);
        setAgencyId(null);
      }
    } catch (error) {
      // If check fails, ensure clean state
      console.error('Auth check failed:', error);
      setUserState(null);
      setAgencyId(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserState]);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Handle route protection
   */
  useEffect(() => {
    if (isLoading) return;

    const authenticated = checkIsAuthenticated();
    const isPublic = isPublicRoute(pathname);

    // Redirect authenticated users away from auth pages
    if (authenticated && (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP)) {
      router.replace(ROUTES.DASHBOARD);
      return;
    }

    // Redirect unauthenticated users to login
    if (!authenticated && !isPublic && pathname !== ROUTES.LOGIN) {
      if (pathname !== ROUTES.HOME) {
        setRedirectPath(pathname);
      }
      router.replace(ROUTES.LOGIN);
    }
  }, [pathname, isLoading, router]);

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const response = await loginApi({
        username: email,
        password: password,
      });

      // Store token (persists across refreshes)
      setAuthToken(response.accessToken);
      
      // Fetch user state to get agency info
      try {
        await fetchUserState();
      } catch (fetchError) {
        // If fetchUserState fails, login is still successful (token is set)
        // User data might not be available, but user can still access the app
        // The error will be handled by the component if needed
      }
    } catch (error) {
      // Re-throw ApiError for handling in UI
      throw error;
    }
  }, [fetchUserState]);

  /**
   * Signup user (TODO: Replace with actual API call)
   */
  const signup = useCallback(
    async (name: string, email: string, password: string, phone: string): Promise<void> => {
      try {
        const response = await signupApi({
          name,
          email,
          password,
          phoneNumber: phone,
        });

        setAuthToken(response.accessToken);

        const fallbackUser: User = {
          id: response.id,
          email,
          name,
          phone,
          phoneNumber: phone,
        };

        setUser(fallbackUser);
        setUserState(fallbackUser);

        try {
          await fetchUserState();
        } catch (fetchError) {
          console.warn('AuthContext: ⚠️ Failed to fetch user state after signup', fetchError);
        }
      } catch (error) {
        throw error;
      }
    },
    [fetchUserState]
  );

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      await forgotPasswordApi({ email });
    } catch (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (password: string, token?: string): Promise<void> => {
    try {
      await resetPasswordApi({ password, token });
    } catch (error) {
      throw error;
    }
  }, []);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<void> => {
      try {
        await changePasswordApi({ oldPassword, newPassword });
      } catch (error) {
        throw error;
      }
    },
    []
  );

  /**
   * Logout user and clear all auth data
   */
  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    setAgencyId(null);
    router.push(ROUTES.LOGIN);
  }, [router]);

  /**
   * Check if user is authenticated (based on token presence)
   */
  const isAuthenticated = !!getAuthToken() || !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticated,
    isLoading,
    agencyId,
    login,
    signup,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    checkAuth,
    fetchUserState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

