// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = [
  'https://openskills.online',            // Your main domain
  'http://openskills.online',            // Your main domain
  'https://gpt.openskills.online',        // Example: Custom GPT on a subdomain
  'https://chatgpt.com',        // Example: Custom GPT on a subdomain
  'http://chatgpt.com',        // Example: Custom GPT on a subdomain
  // Add more origins as needed
];

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if the request is targeting the API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    const origin = req.headers.get('origin');

    // CORS Headers
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      // Optionally, set to a default allowed origin or deny
      res.headers.set('Access-Control-Allow-Origin', 'https://openskills.online');
    }

    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, userId');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: res.headers,
      });
    }
  }

  return res;
}

export const config = {
  matcher: '/api/:path*',
};
