// Global fetch wrapper for daemon API calls.
// In production with a remote daemon (e.g. Render), all /api/* calls must
// go to the remote URL with the Authorization token. In local dev, relative
// paths work fine because Next.js rewrites proxy to the local daemon.

const DAEMON_BASE_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DAEMON_URL)
  || (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_DAEMON_URL)
  || '';

const DAEMON_API_TOKEN = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DAEMON_TOKEN)
  || (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_DAEMON_TOKEN)
  || '';

function daemonUrl(path: string): string {
  const base = DAEMON_BASE_URL.replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}

export function odFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = daemonUrl(path);
  const headers: Record<string, string> = {};
  if (DAEMON_API_TOKEN) {
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
