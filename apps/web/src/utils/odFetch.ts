// Global fetch wrapper for daemon API calls.
// Uses relative /api/* paths so Next.js middleware can proxy to the
// remote daemon with the server-side Authorization token.

export function odFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(path, init);
}
