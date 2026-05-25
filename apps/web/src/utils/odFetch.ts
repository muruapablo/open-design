// Global fetch wrapper for daemon API calls.
// Calls go directly to the remote daemon URL with the Authorization token.
// CORS is enabled on the daemon via OD_ALLOWED_ORIGINS=*.

const DAEMON_BASE_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DAEMON_URL)
  || (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_DAEMON_URL)
  || 'https://open-design-daemon-2asm.onrender.com';

const DAEMON_API_TOKEN = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DAEMON_TOKEN)
  || (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_DAEMON_TOKEN)
  || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk2NDg2ODksImlkIjoiMDE5ZTViNTMtNmMwMS03MDZiLTgwNDAtYzQ2OGJhNDQ0NWYxIiwicmlkIjoiM2MxOGQ1ZGEtYjRhOC00YzJmLWJmN2QtOWQ3NmVjMzU3OTgxIn0.IYLFwNNgRZmCgxhuvE1yX4dNKOd4eRi_jShLboUgtYziaOGqk7_mSDHOoKShc3IAev5NSMPTO228Y6smDechBw';

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
