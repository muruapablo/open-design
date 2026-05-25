// Global fetch wrapper for daemon API calls.
// In production (Vercel), connects directly to the remote daemon on Render.
// CORS is enabled on the daemon via OD_ALLOWED_ORIGINS=*.

// Production daemon URL (Render)
const PROD_DAEMON_URL = 'https://open-design-daemon-2asm.onrender.com';

// Production API token
const PROD_DAEMON_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk2NDg2ODksImlkIjoiMDE5ZTViNTMtNmMwMS03MDZiLTgwNDAtYzQ2OGJhNDQ0NWYxIiwicmlkIjoiM2MxOGQ1ZGEtYjRhOC00YzJmLWJmN2QtOWQ3NmVjMzU3OTgxIn0.IYLFwNNgRZmCgxhuvE1yX4dNKOd4eRi_jShLboUgtYziaOGqk7_mSDHOoKShc3IAev5NSMPTO228Y6smDechBw';

function daemonUrl(path: string): string {
  const base = PROD_DAEMON_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export function odFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = daemonUrl(path);
  const headers: Record<string, string> = {};

  if (PROD_DAEMON_TOKEN) {
    headers['Authorization'] = `Bearer ${PROD_DAEMON_TOKEN}`;
  }

  return fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers as Record<string, string> || {}),
    },
  });
}

// Intercept global fetch to redirect relative daemon paths to remote daemon
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let path: string | undefined;
    if (typeof input === 'string') {
      path = input;
    } else if (input instanceof URL) {
      path = input.pathname;
    } else if (input instanceof Request) {
      path = input.url;
    }
    
    if (path && (path.startsWith('/api/') || path.startsWith('/artifacts/') || path.startsWith('/frames/'))) {
      return odFetch(path, init);
    }
    
    return originalFetch(input, init);
  };
}
