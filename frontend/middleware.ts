// middleware.js
import { NextResponse } from 'next/server';

// Paths that don't need authentication
const publicPaths = ['/auth'];

export default function middleware(request:any) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;

  // Case 1: User is logged in and tries to go to /auth → redirect to /folder/root
  if (sessionToken && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/folder/root', request.url));
  }

  // Case 2: User is NOT logged in and tries to access /folder/... → redirect to /auth
  if (!sessionToken && pathname.startsWith('/folder')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Allow everything else
  return NextResponse.next();
}

// Apply middleware only to relevant routes
export const config = {
  matcher: [
    '/auth',
    '/folder/:path*', // Covers /folder and /folder/anything
  ],
};