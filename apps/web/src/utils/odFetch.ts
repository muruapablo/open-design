// Global fetch wrapper for daemon API calls.
// Uses relative /api/* paths so Next.js API routes can proxy to the
// remote daemon with the server-side Authorization token, avoiding CORS.

export function odFetch(path: string, init?: RequestInit): Promise<Response> {
  // Always use relative paths so the request goes through Next.js
  // API routes which proxy to the daemon with proper auth headers.
  return fetch(path, init);
}
