/**
 * Daemon connection state — mini store for the "Connect / Disconnect" button.
 * When disconnected, the frontend skips health-check pings and polling loops
 * so the remote daemon (e.g. on Render free tier) can sleep after 15 min.
 */

let connected = true; // default: auto-connect on first load
const listeners = new Set<() => void>();

export function isDaemonConnected(): boolean {
  return connected;
}

export function connectDaemon(): void {
  if (connected) return;
  connected = true;
  listeners.forEach((fn) => fn());
}

export function disconnectDaemon(): void {
  if (!connected) return;
  connected = false;
  listeners.forEach((fn) => fn());
}

export function toggleDaemonConnection(): boolean {
  connected = !connected;
  listeners.forEach((fn) => fn());
  return connected;
}

export function subscribeDaemonConnection(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
