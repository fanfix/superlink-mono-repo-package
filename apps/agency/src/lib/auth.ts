/**
 * Authentication utilities
 * Handles token storage, retrieval, and validation
 */

import type { AgencyInfo } from '../api/types';

const AUTH_TOKEN_KEY = 'auth-token';
const AUTH_USER_KEY = 'auth-user';
const AUTH_AGENCY_ID_KEY = 'auth-agency-id';
const REDIRECT_PATH_KEY = 'redirect-path';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  imageURL?: string | null;
  agencyId?: string | null;
  agency?: AgencyInfo | null;
}

/**
 * Get authentication token from cookies
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${AUTH_TOKEN_KEY}=`));
  
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  
  // Also check localStorage as fallback
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set authentication token in cookie and localStorage
 * Cookie persists across page refreshes
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Set cookie with 30 days expiry (persists across refreshes)
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
  // Only use Secure flag in production/HTTPS
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
  
  // Also store in localStorage as backup
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  // Remove cookie
  document.cookie = `${AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
  // Remove from localStorage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Get user data from localStorage
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Set user data in localStorage
 */
export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Get agency ID from localStorage
 */
export function getAgencyId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_AGENCY_ID_KEY);
}

/**
 * Set agency ID in localStorage
 */
export function setAgencyId(agencyId: string | null): void {
  if (typeof window === 'undefined') return;
  if (agencyId) {
    localStorage.setItem(AUTH_AGENCY_ID_KEY, agencyId);
  } else {
    localStorage.removeItem(AUTH_AGENCY_ID_KEY);
  }
}

/**
 * Clear all auth data
 */
export function clearAuth(): void {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_AGENCY_ID_KEY);
  }
}

/**
 * Validate token (you can add API call here to verify token with server)
 */
export async function validateToken(token: string): Promise<boolean> {
  // TODO: Replace with actual API call to validate token
  // For now, just check if token exists
  return !!token;
}

/**
 * Store redirect path in sessionStorage (not in URL)
 */
export function setRedirectPath(path: string): void {
  if (typeof window === 'undefined') return;
  // Only store if it's a valid protected route (not root or public routes)
  if (path && path !== '/' && !path.startsWith('/login') && !path.startsWith('/signup') && !path.startsWith('/reset-password')) {
    sessionStorage.setItem(REDIRECT_PATH_KEY, path);
  }
}

/**
 * Get redirect path from sessionStorage
 */
export function getRedirectPath(): string | null {
  if (typeof window === 'undefined') return null;
  const path = sessionStorage.getItem(REDIRECT_PATH_KEY);
  if (path) {
    sessionStorage.removeItem(REDIRECT_PATH_KEY); // Clear after reading
    return path;
  }
  return null;
}

/**
 * Clear redirect path
 */
export function clearRedirectPath(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(REDIRECT_PATH_KEY);
}

