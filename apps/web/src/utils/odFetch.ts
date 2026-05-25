// Global fetch wrapper for daemon API calls.
// In production (Vercel), all calls go through Next.js middleware rewrite to avoid CORS.
// In local dev, calls go directly to the daemon via NEXT_PUBLIC_DAEMON_URL or OD_PORT.

const DAEMON_BASE_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DAEMON_URL)
  || (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_DAEMON_URL)
  || '';

const DAEMON_API_TOKEN = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DAEMON_TOKEN)
  || (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_DAEMON_TOKEN)
  || '';

function daemonUrl(path: string): string {
  // In browser, always use relative paths (middleware handles proxy in prod,
  // dev rewrites handle it in local development)
  if (typeof window !== 'undefined') return path;

  const base = DAEMON_BASE_URL.replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}

export function odFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = daemonUrl(path);
  const headers: Record<string, string> = {};

  // Only send token when calling daemon directly from server-side
  if (DAEMON_API_TOKEN && typeof window === 'undefined') {
    headers['Authorization'] = `Bearer ${DAEMON_API_TOKEN}`;
  }

  return fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers as Record<string, string> || {}),
    },
  });
}
