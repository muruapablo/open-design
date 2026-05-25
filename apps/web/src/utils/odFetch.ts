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
    let url: string | undefined;
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input instanceof Request) {
      url = input.url;
    }
    
    // If it's a relative path starting with /api/, /artifacts/, or /frames/
    if (url && (url.startsWith('/api/') || url.startsWith('/artifacts/') || url.startsWith('/frames/'))) {
      return odFetch(url, init);
    }
    
    // If it's a full URL to the current origin, extract the path
    if (url) {
      try {
        const parsed = new URL(url);
        const path = parsed.pathname;
        if (path.startsWith('/api/') || path.startsWith('/artifacts/') || path.startsWith('/frames/')) {
          return odFetch(path + parsed.search, init);
        }
      } catch {
        // Not a valid URL, ignore
      }
    }
    
    return originalFetch(input, init);
  };
}
