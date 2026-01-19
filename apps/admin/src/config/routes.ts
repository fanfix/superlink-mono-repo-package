/**
 * Route configuration for the Admin Panel
 * Centralized route definitions for maintainability
 */

export const ROUTES = {
  // Root route (redirects based on auth state)
  HOME: '/',
  // Public routes (accessible without authentication)
  LOGIN: '/login',
  RESET_PASSWORD: '/password/reset',
  
  // Protected routes (require authentication)
  DASHBOARD: '/dashboard',
  USERS: '/users',
  BIOS: '/bios',
  REPORTS: '/reports',
  ADMINS: '/admins',
  AGENCIES: '/agencies',
  SUBSCRIPTIONS: '/subscriptions',
  BRAND_KIT_LEADS: '/brand-kit-leads',
  SUPERLOCKEDS: '/superlockeds',
  
  // Error pages
  NOT_FOUND: '/404',
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.RESET_PASSWORD,
] as const;

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.USERS,
  ROUTES.BIOS,
  ROUTES.REPORTS,
  ROUTES.ADMINS,
  ROUTES.AGENCIES,
  ROUTES.SUBSCRIPTIONS,
  ROUTES.BRAND_KIT_LEADS,
  ROUTES.SUPERLOCKEDS,
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

