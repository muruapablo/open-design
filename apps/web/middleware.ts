import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DAEMON_URL = process.env.DAEMON_URL || 'https://open-design-daemon-2asm.onrender.com';
const DAEMON_TOKEN = process.env.DAEMON_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk2NDg2ODksImlkIjoiMDE5ZTViNTMtNmMwMS03MDZiLTgwNDAtYzQ2OGJhNDQ0NWYxIiwicmlkIjoiM2MxOGQ1ZGEtYjRhOC00YzJmLWJmN2QtOWQ3NmVjMzU3OTgxIn0.IYLFwNNgRZmCgxhuvE1yX4dNKOd4eRi_jShLboUgtYziaOGqk7_mSDHOoKShc3IAev5NSMPTO228Y6smDechBw';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proxy /api/*, /artifacts/*, and /frames/* to the remote daemon
  if (pathname.startsWith('/api/') || pathname.startsWith('/artifacts/') || pathname.startsWith('/frames/')) {
    const targetUrl = new URL(pathname + request.nextUrl.search, DAEMON_URL);
    const requestHeaders = new Headers(request.headers);

    if (DAEMON_TOKEN) {
      requestHeaders.set('Authorization', `Bearer ${DAEMON_TOKEN}`);
    }

    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/artifacts/:path*', '/frames/:path*'],
};
