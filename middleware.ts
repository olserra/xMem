// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only set CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS method
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: res.headers,
      });
    }
  }

  return res;
}

// Configure the middleware to run on API routes
export const config = {
  matcher: '/api/:path*',
};
