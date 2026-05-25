import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only proxy API, artifacts, and frames routes
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

  // Build the destination URL
  const destination = new URL(pathname + request.nextUrl.search, daemonUrl);

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add Authorization header if we have a token
  if (daemonToken) {
    requestHeaders.set('Authorization', `Bearer ${daemonToken}`);
  }

  // Rewrite to the daemon while keeping the browser URL
  return NextResponse.rewrite(destination, {
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/:path*', '/artifacts/:path*', '/frames/:path*'],
};
