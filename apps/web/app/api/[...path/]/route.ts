import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return proxyRequest(request);
}

async function proxyRequest(request: NextRequest) {
  const daemonUrl = process.env.NEXT_PUBLIC_DAEMON_URL;
  const daemonToken = process.env.NEXT_PUBLIC_DAEMON_TOKEN;

  if (!daemonUrl) {
    return NextResponse.json(
      { error: 'Daemon URL not configured' },
      { status: 503 }
    );
  }

  // Extract the path after /api/
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '');
  const search = url.search;

  // Build destination URL
  const destination = `${daemonUrl.replace(/\/$/, '')}${path}${search}`;

  // Clone headers and add Authorization
  const headers = new Headers(request.headers);
  if (daemonToken) {
    headers.set('Authorization', `Bearer ${daemonToken}`);
  }

  // Remove host header (will be set by fetch automatically)
  headers.delete('host');

  try {
    const response = await fetch(destination, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.arrayBuffer() 
        : undefined,
    });

    // Create response with all headers from daemon
    const responseHeaders = new Headers(response.headers);
    
    // Add CORS headers to allow the frontend
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to daemon' },
      { status: 502 }
    );
  }
}
