// ============================================
// AUTH MIDDLEWARE - ROUTE PROTECTION
// ============================================
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
    '/',
    '/login',
    '/auth',
    '/productos',
    '/tienda',
    '/store',
    '/carrito',
    '/checkout'
];

// Public API routes
const publicApiRoutes = [
    '/api/auth',
    '/api/products',
    '/api/webhooks'
];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // Check if this is a public route
    const isPublicRoute = publicRoutes.some(route => {
        if (route === '/') {
            return pathname === '/';
        }
        return pathname === route || pathname.startsWith(route + '/');
    });

    // Check if this is a public API route
    const isPublicApi = publicApiRoutes.some(route => pathname.startsWith(route));

    // Allow public routes and APIs without authentication
    if (isPublicRoute || isPublicApi) {
        return NextResponse.next();
    }

    // For protected routes, require authentication
    if (!isLoggedIn) {
        const loginUrl = new URL('/auth', req.nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Match all routes except static files and Next.js internals
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.webp$|sw\\.js$).*)'
    ]
};
