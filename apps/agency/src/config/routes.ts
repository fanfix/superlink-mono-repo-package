/**
 * Route configuration for the Agency Portal
 * Centralized route definitions for maintainability
 */

export const ROUTES = {
  // Root route (redirects based on auth state)
  HOME: '/',
  // Public routes (accessible without authentication)
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  
  // Protected routes (require authentication)
  DASHBOARD: '/dashboard',
  DASHBOARD_TEAMS: '/dashboard/teams',
  DASHBOARD_CREATOR: '/dashboard/creator',
  DASHBOARD_SUPERLOCKED: '/dashboard/superlocked',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_REFERRED: '/dashboard/referred',
  
  // Error pages
  NOT_FOUND: '/404',
} as const;

/**
 * Public routes that don't require authentication
 * Note: HOME (/) is not included as it redirects based on auth state
 */
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.RESET_PASSWORD,
] as const;

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.DASHBOARD_TEAMS,
  ROUTES.DASHBOARD_CREATOR,
  ROUTES.DASHBOARD_SUPERLOCKED,
  ROUTES.DASHBOARD_SETTINGS,
  ROUTES.DASHBOARD_REFERRED,
] as const;

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

/**
 * Check if a path is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

