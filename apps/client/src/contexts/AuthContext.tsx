/**
 * Global Auth Context
 * Provides centralized auth state to prevent duplicate API calls
 * Professional flow like superlink-main
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { getAuthToken } from '../lib/auth';
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
  refreshAuth: () => Promise<void>;
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
  const refreshAuth = useCallback(async () => {
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
    if (isFetchingRef.current || (now - lastFetchTimeRef.current < CACHE_DURATION)) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      // Call both APIs in parallel (like superlink-main)
      const [stateData, userData] = await Promise.all([
        getAuthStateApi(),
        getCurrentUserApi(),
      ]);

      setUserState(stateData);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      lastFetchTimeRef.current = now;

      // Store in localStorage for quick access
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('auth-user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          username: userData.bio?.username || userData.name,
          imageURL: userData.bio?.imageURL || null,
        }));
      }
    } catch (error) {
      console.error('[AuthContext] Failed to fetch auth:', error);
      setIsAuthenticated(false);
      setUserState(null);
      setCurrentUser(null);
      
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth-user');
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
      localStorage.removeItem('auth-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-user');
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

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

