// ─────────────────────────────────────────────────────────────
// Server-Side Rate Limiting
// Uses Upstash Redis if configured, falls back to in-memory Map
// Production gap: C7 — replaces client-side-only rate limiting
// ─────────────────────────────────────────────────────────────

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── In-memory fallback for development / when Redis not configured ──

const inMemoryStore = new Map();

class InMemoryRatelimit {
  /**
   * @param {{ requests: number, window: string }} config
   */
  constructor({ requests, window }) {
    this.requests = requests;
    this.windowMs = parseWindow(window);
  }

  /**
   * @param {string} identifier
   * @returns {Promise<{ success: boolean, limit: number, remaining: number, reset: number }>}
   */
  async limit(identifier) {
    const now = Date.now();
    const key = `${this.requests}:${this.windowMs}:${identifier}`;
    const record = inMemoryStore.get(key);

    if (!record || now > record.reset) {
      // Clean up expired entry before replacing
      if (record) inMemoryStore.delete(key);
      // Periodic sweep: if store exceeds 10k entries, purge all expired
      if (inMemoryStore.size > 10_000) {
        for (const [k, v] of inMemoryStore) {
          if (now > v.reset) inMemoryStore.delete(k);
        }
      }
      const reset = now + this.windowMs;
      inMemoryStore.set(key, { count: 1, reset });
      return { success: true, limit: this.requests, remaining: this.requests - 1, reset };
    }

    record.count += 1;
    if (record.count > this.requests) {
      return { success: false, limit: this.requests, remaining: 0, reset: record.reset };
    }

    return {
      success: true,
      limit: this.requests,
      remaining: this.requests - record.count,
      reset: record.reset,
    };
  }
}

/** @param {string} window — e.g. "1 m", "1 h", "10 s" */
function parseWindow(window) {
  const match = window.match(/^(\d+)\s*(s|m|h|d)$/);
  if (!match) return 60_000; // fallback 1 minute
  const [, n, unit] = match;
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return parseInt(n) * (multipliers[unit] || 60_000);
}

// ── Factory ─────────────────────────────────────────────────

const useRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Create a rate limiter for a specific endpoint.
 *
 * @param {{ requests: number, window: string, prefix?: string }} config
 * @returns {{ limit: (identifier: string) => Promise<{ success: boolean, limit: number, remaining: number, reset: number }> }}
 *
 * @example
 *   const limiter = createRateLimit({ requests: 5, window: "1 h", prefix: "contact" });
 *   const { success } = await limiter.limit(ip);
 */
export function createRateLimit({ requests, window, prefix = "api" }) {
  if (useRedis) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix: `wup:rl:${prefix}`,
      analytics: true,
    });
  }

  // Development / fallback
  if (process.env.NODE_ENV === "development") {
    console.log(`[rate-limit] Using in-memory store for "${prefix}" (no Redis configured)`);
  }
  return new InMemoryRatelimit({ requests, window });
}

// ── Pre-configured limiters for each endpoint ───────────────

/** Auth registration: 3 per IP per hour */
export const registerLimiter = createRateLimit({
  requests: 3,
  window: "1 h",
  prefix: "register",
});

/** Login attempts: 5 per IP per 15 minutes */
export const loginLimiter = createRateLimit({
  requests: 5,
  window: "15 m",
  prefix: "login",
});

/** Email/username check: 10 per IP per minute */
export const checkLimiter = createRateLimit({
  requests: 10,
  window: "1 m",
  prefix: "check",
});

/** Contact form: 5 per IP per hour */
export const contactLimiter = createRateLimit({
  requests: 5,
  window: "1 h",
  prefix: "contact",
});

/** Password reset: 3 per email per hour */
export const resetLimiter = createRateLimit({
  requests: 3,
  window: "1 h",
  prefix: "reset",
});

/** Email verification resend: 3 per email per hour */
export const verifyLimiter = createRateLimit({
  requests: 3,
  window: "1 h",
  prefix: "verify",
});

// ── Helper to extract IP from request ───────────────────────

/**
 * @param {Request} req
 * @returns {string}
 */
export function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "127.0.0.1";
}

/**
 * Standard rate limit response headers
 * @param {{ limit: number, remaining: number, reset: number }} result
 */
export function rateLimitHeaders(result) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
  };
}
