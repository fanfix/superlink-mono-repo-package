import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES, PROTECTED_ROUTES, isPublicRoute, isProtectedRoute, ROUTES } from './config/routes';

/**
 * Middleware for route protection and authentication
 * 
 * Public routes: /login, /signup, /reset-password
 * Protected routes: /dashboard and all sub-routes
 * Root route (/) redirects based on auth state (handled in page.tsx)
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated via cookie
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // Root route - let page.tsx handle the redirect
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Handle public routes (login, signup, reset-password)
  if (isPublicRoute(pathname)) {
    // If user is already authenticated and tries to access login/signup, redirect to dashboard
    if (isAuthenticated && (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP)) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
    // Allow access to public routes
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    // If not authenticated, redirect to login (without redirect param in URL)
    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
      // Store redirect path in cookie (will be read and moved to sessionStorage on client)
      if (pathname !== ROUTES.HOME) {
        response.cookies.set('redirect-path', pathname, {
          httpOnly: false, // Allow client-side access
          maxAge: 60, // 60 seconds
          path: '/',
          sameSite: 'lax',
        });
      }
      return response;
    }
    // Allow access to protected routes
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

