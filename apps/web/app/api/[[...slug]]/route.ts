import { NextRequest, NextResponse } from 'next/server';

const DAEMON_URL = process.env.DAEMON_URL || 'https://open-design-daemon-2asm.onrender.com';
const DAEMON_TOKEN = process.env.DAEMON_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk2NDg2ODksImlkIjoiMDE5ZTViNTMtNmMwMS03MDZiLTgwNDAtYzQ2OGJhNDQ0NWYxIiwicmlkIjoiM2MxOGQ1ZGEtYjRhOC00YzJmLWJmN2QtOWQ3NmVjMzU3OTgxIn0.IYLFwNNgRZmCgxhuvE1yX4dNKOd4eRi_jShLboUgtYziaOGqk7_mSDHOoKShc3IAev5NSMPTO228Y6smDechBw';

export async function GET(request: NextRequest, { params }: { params: { slug?: string[] } }) {
  return proxy(request, params.slug);
}

export async function POST(request: NextRequest, { params }: { params: { slug?: string[] } }) {
  return proxy(request, params.slug);
}

export async function PUT(request: NextRequest, { params }: { params: { slug?: string[] } }) {
  return proxy(request, params.slug);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug?: string[] } }) {
  return proxy(request, params.slug);
}

export async function PATCH(request: NextRequest, { params }: { params: { slug?: string[] } }) {
  return proxy(request, params.slug);
}

export async function OPTIONS(request: NextRequest, { params }: { params: { slug?: string[] } }) {
  return proxy(request, params.slug);
}

async function proxy(request: NextRequest, slug: string[] | undefined) {
  const path = slug ? '/' + slug.join('/') : '';
  const query = request.nextUrl.search;
  const targetUrl = `${DAEMON_URL.replace(/\/$/, '')}${path}${query}`;

  const headers: Record<string, string> = {};
  if (DAEMON_TOKEN) {
    headers['Authorization'] = `Bearer ${DAEMON_TOKEN}`;
  }

  // Forward relevant headers
  const forwardHeaders = ['content-type', 'accept'];
  for (const h of forwardHeaders) {
    const val = request.headers.get(h);
    if (val) headers[h] = val;
  }

  let body: BodyInit | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    body = await request.arrayBuffer();
  }

  try {
    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const resBody = await res.arrayBuffer();
    const response = new NextResponse(resBody, {
      status: res.status,
      statusText: res.statusText,
    });

    // Forward relevant response headers
    const resHeaders = ['content-type', 'content-length', 'etag', 'cache-control'];
    for (const h of resHeaders) {
      const val = res.headers.get(h);
      if (val) response.headers.set(h, val);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy error', message: err.message }, { status: 502 });
  }
}
