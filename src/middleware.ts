// ============================================
// AUTH MIDDLEWARE - ROUTE PROTECTION
// ============================================
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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

    // For protected routes, check authentication
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'sellast-secret-key-change-in-production'
    });

    if (!token) {
        const loginUrl = new URL('/auth', request.nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all routes except static files and Next.js internals
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.webp$|sw\\.js$).*)'
    ]
};
