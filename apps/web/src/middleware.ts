import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only intercept /api/*, /artifacts/*, and /frames/* routes
  if (
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/artifacts/') &&
    !pathname.startsWith('/frames/')
  ) {
    return NextResponse.next();
  }

  const daemonUrl = process.env.NEXT_PUBLIC_DAEMON_URL;
  const daemonToken = process.env.NEXT_PUBLIC_DAEMON_TOKEN;

  if (!daemonUrl) {
    return NextResponse.next();
  }

  // Build destination URL
  const base = daemonUrl.replace(/\/$/, '');
  const destination = new URL(`${pathname}${search}`, base);

  // Create request with Authorization header
  const requestHeaders = new Headers(request.headers);
  if (daemonToken) {
    requestHeaders.set('Authorization', `Bearer ${daemonToken}`);
  }

  // Remove host header to avoid conflicts
  requestHeaders.delete('host');

  // Rewrite to daemon while keeping browser URL
  return NextResponse.rewrite(destination, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/artifacts/:path*',
    '/frames/:path*',
  ],
};
