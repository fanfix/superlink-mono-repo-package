/**
 * Global Auth Context
 * Provides centralized auth state to prevent duplicate API calls
 * Professional flow like superlink-main
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { getAuthToken, removeAuthToken } from '../lib/auth';
import { getAuthStateApi } from '../api/services/authService';
import { getCurrentUserApi } from '../api/services/profileService';
import type { UserState, CurrentUser } from '../api/types';

interface AuthContextValue {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  userState: UserState | null;
  currentUser: CurrentUser | null;
  
  // Actions
  refreshAuth: (force?: boolean) => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  /** Auto-fetch auth on mount */
  autoFetch?: boolean;
}

/**
 * Global Auth Provider
 * Manages auth state globally to prevent duplicate API calls
 */
export function AuthProvider({ children, autoFetch = true }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  
  // Prevent duplicate calls
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const CACHE_DURATION = 5000; // 5 seconds cache

  /**
   * Refresh auth state (cached to prevent duplicates)
   */
  const refreshAuth = useCallback(async (force: boolean = false) => {
    const token = getAuthToken();
    
    if (!token) {
      setIsAuthenticated(false);
      setUserState(null);
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    // Prevent duplicate calls within cache duration
    const now = Date.now();
    if (!force && (isFetchingRef.current || (now - lastFetchTimeRef.current < CACHE_DURATION))) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      // IMPORTANT:
      // - /auth/state works for all authenticated users
      // - currentUser GraphQL can fail for users that haven't completed onboarding/bio yet
      // So we fetch state first, and only call currentUser when bio exists.
      const stateData = await getAuthStateApi();
      setUserState(stateData);
      setIsAuthenticated(true);
      lastFetchTimeRef.current = now;

      const hasBio = !!(stateData?.bio?.id || stateData?.bioId);
      if (!hasBio) {
        // Do not call currentUser until bio exists
        setCurrentUser(null);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'auth-user',
            JSON.stringify({
              id: stateData?.id,
              name: stateData?.name ?? null,
              email: stateData?.email ?? null,
              username: stateData?.username ?? stateData?.name ?? null,
              imageURL: stateData?.bio?.imageURL ?? stateData?.imageURL ?? null,
            })
          );
        }
        return;
      }

      // Bio exists -> safe to fetch full currentUser
      try {
        const userData = await getCurrentUserApi();
        setCurrentUser(userData);
        if (typeof window !== 'undefined' && userData) {
          localStorage.setItem(
            'auth-user',
            JSON.stringify({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              username: userData.bio?.username || userData.name,
              imageURL: userData.bio?.imageURL || null,
            })
          );
        }
      } catch {
        // Keep user authenticated via /auth/state, but don't crash the app
        setCurrentUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUserState(null);
      setCurrentUser(null);
      
      // Clear invalid token
      if (typeof window !== 'undefined') {
        removeAuthToken();
        localStorage.removeItem('auth-user');
        localStorage.removeItem('onboarding-complete');
        sessionStorage.removeItem('onboarding-in-progress');
        sessionStorage.removeItem('stripe_connect_redirect');
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  /**
   * Clear auth state
   */
  const clearAuth = useCallback(() => {
    setIsAuthenticated(false);
    setUserState(null);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      removeAuthToken();
      localStorage.removeItem('auth-user');
      localStorage.removeItem('onboarding-complete');
      sessionStorage.removeItem('onboarding-in-progress');
      sessionStorage.removeItem('stripe_connect_redirect');
      sessionStorage.removeItem('login-phone');
      sessionStorage.removeItem('signup-phone');
      sessionStorage.removeItem('auth-flow');
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refreshAuth();
    }
  }, [autoFetch, refreshAuth]);

  // Refresh on token change (listen to storage events)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-token' || e.key === 'accessToken') {
        refreshAuth();
      }
    };

    const handleSameTabTokenChange = () => {
      refreshAuth(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-token-changed', handleSameTabTokenChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-token-changed', handleSameTabTokenChange);
    };
  }, [refreshAuth]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    userState,
    currentUser,
    refreshAuth,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

