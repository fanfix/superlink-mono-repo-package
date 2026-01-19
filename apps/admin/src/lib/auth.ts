/**
 * Authentication utilities
 * Handles token storage, retrieval, and validation
 */

const AUTH_TOKEN_KEY = 'admin-auth-token';
const AUTH_USER_KEY = 'admin-auth-user';
const REDIRECT_PATH_KEY = 'admin-redirect-path';

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  phoneNumber?: string | null;
  isAdmin?: boolean;
  [key: string]: any;
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set authentication token in localStorage and cookie
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  
  // Also set in cookie for middleware to check
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  
  // Also remove cookie
  document.cookie = `${AUTH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
export function getUser(): AdminUser | null {
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
export function setUser(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

/**
 * Clear all auth data
 */
export function clearAuth(): void {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_KEY);
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
 * Store redirect path in sessionStorage
 */
export function setRedirectPath(path: string): void {
  if (typeof window === 'undefined') return;
  // Only store if it's a valid protected route
  if (path && path !== '/' && !path.startsWith('/login') && !path.startsWith('/password')) {
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

