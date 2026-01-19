'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AdminUser, 
  getAuthToken, 
  setAuthToken, 
  getUser, 
  setUser, 
  clearAuth, 
  isAuthenticated as checkIsAuthenticated, 
  setRedirectPath,
  getRedirectPath,
} from '../lib/auth';
import { ROUTES, isPublicRoute } from '../config/routes';
import {
  loginApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '../api/services/authService';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Check authentication status and load user data
   */
  const checkAuth = useCallback(async () => {
    try {
      const token = getAuthToken();
      const userData = getUser();
      
      if (token) {
        // If we have user data in localStorage, use it initially
        if (userData) {
          setUserState(userData);
        }
        // For admin, we can add API call to verify token if needed
        // For now, we'll just use the stored user data
      } else {
        // No token, clear everything
        setUserState(null);
      }
    } catch (error) {
      // If check fails, ensure clean state
      console.error('Auth check failed:', error);
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    if (authenticated && pathname === ROUTES.LOGIN) {
      const redirectPath = getRedirectPath() || ROUTES.DASHBOARD;
      router.replace(redirectPath);
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
   * Login user with username and password
   */
  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      const response = await loginApi({
        username: username,
        password: password,
      });

      // Store token
      setAuthToken(response.accessToken);
      
      // Create user object from response if available
      if (response.id || response.email) {
        const userData: AdminUser = {
          id: response.id || '',
          email: response.email || username,
          name: response.name || null,
          phoneNumber: response.phoneNumber || null,
          isAdmin: response.isAdmin || true,
        };
        
        setUser(userData);
        setUserState(userData);
      }
    } catch (error) {
      // Re-throw ApiError for handling in UI
      throw error;
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      await forgotPasswordApi({ email });
    } catch (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (password: string, token?: string): Promise<void> => {
    try {
      if (!token) {
        throw new Error('Reset token is required');
      }
      await resetPasswordApi({ password, token });
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Logout user and clear all auth data
   */
  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
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
    login,
    forgotPassword,
    resetPassword,
    logout,
    checkAuth,
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

