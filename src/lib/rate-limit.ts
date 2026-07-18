/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Low-risk and dependency-free — suitable for a single Node instance (the
 * Hostinger deployment). State is per-process: it resets on restart and is not
 * shared across multiple instances. For a multi-instance setup, back this with
 * Redis or a database table using the same interface.
 */

type Window = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Window>();

// Opportunistic cleanup so the Map can't grow unbounded.
function sweep(now: number) {
  if (store.size < 5000) return;
  for (const [key, window] of store) {
    if (window.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

/**
 * @param key      Identifier to throttle (e.g. an IP address).
 * @param limit    Max allowed hits per window.
 * @param windowMs Window duration in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count };
}
