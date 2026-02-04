/**
 * Authentication utilities
 * Handles token storage, retrieval, and validation for Client App
 * Compatible with superlink-main authentication flow
 */

const AUTH_TOKEN_KEY = 'auth-token';
const ACCESS_TOKEN_KEY = 'accessToken'; // Cookie key (superlink-main compatibility)
const COOKIE_EXPIRY_DAYS = 7; // 7 days expiry (same as superlink-main)

/**
 * Cookie utility functions (simple implementation without external library)
 */
function setCookie(name: string, value: string, days: number = COOKIE_EXPIRY_DAYS): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Get authentication token
 * Checks both localStorage and cookies (superlink-main compatibility)
 * Priority: localStorage > cookie
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // First check localStorage (auth-token)
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    // Sync to cookie if not present
    if (!getCookie(ACCESS_TOKEN_KEY)) {
      setCookie(ACCESS_TOKEN_KEY, token, COOKIE_EXPIRY_DAYS);
    }
    return token;
  }
  
  // Check localStorage (accessToken - legacy)
  const accessTokenLocal = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessTokenLocal) {
    // Migrate to standard key
    localStorage.setItem(AUTH_TOKEN_KEY, accessTokenLocal);
    setCookie(ACCESS_TOKEN_KEY, accessTokenLocal, COOKIE_EXPIRY_DAYS);
    return accessTokenLocal;
  }
  
  // Check cookie (superlink-main compatibility)
  const accessTokenCookie = getCookie(ACCESS_TOKEN_KEY);
  if (accessTokenCookie) {
    // Sync to localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, accessTokenCookie);
    return accessTokenCookie;
  }
  
  return null;
}

/**
 * Set authentication token
 * Stores in both localStorage and cookie (superlink-main compatibility)
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Store in localStorage (primary)
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  
  // Also store in cookie (superlink-main compatibility)
  setCookie(ACCESS_TOKEN_KEY, token, COOKIE_EXPIRY_DAYS);

  // Notify same-tab listeners (storage event doesn't fire in same tab)
  window.dispatchEvent(new Event('auth-token-changed'));
}

/**
 * Remove authentication token
 * Removes from both localStorage and cookies
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  removeCookie(ACCESS_TOKEN_KEY);

  window.dispatchEvent(new Event('auth-token-changed'));
}

/**
 * Clear all auth data
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  removeAuthToken();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

