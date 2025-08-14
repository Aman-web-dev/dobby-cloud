// middleware.js
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import {app} from './app/lib/firebase';

// List of paths that don't require authentication
const publicPaths = ['/auth']

export default function middleware(request:any) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('session')?.value

  // If the user is logged in and tries to access auth pages, redirect to home
  if (sessionToken && publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/folder', request.url))
  }

  // If the user is not logged in and tries to access protected pages, redirect to auth
  if (!sessionToken && !publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

// Specify the paths the middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}