// ─────────────────────────────────────────────────────────────
// Environment Variable Validation
// Fails fast at startup if required variables are missing
// Import in layout.tsx or next.config.js to validate early
// ─────────────────────────────────────────────────────────────

/** @param {string} name */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `See .env.example for the full list of required variables.`
    );
  }
  return value;
}

/** @param {string} name @param {string} fallback */
function optional(name, fallback = "") {
  return process.env[name] || fallback;
}

// ── Validate at import time (server only) ───────────────────

export const env = {
  // Auth
  AUTH_SECRET: required("AUTH_SECRET"),

  // Database
  DATABASE_URL: required("DATABASE_URL"),

  // reCAPTCHA
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: required("NEXT_PUBLIC_RECAPTCHA_SITE_KEY"),
  RECAPTCHA_SECRET_KEY: required("RECAPTCHA_SECRET_KEY"),

  // OAuth (optional — degrade gracefully if not set)
  GOOGLE_CLIENT_ID: optional("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: optional("GOOGLE_CLIENT_SECRET"),
  APPLE_ID: optional("APPLE_ID"),
  APPLE_SECRET: optional("APPLE_SECRET"),
  FACEBOOK_CLIENT_ID: optional("FACEBOOK_CLIENT_ID"),
  FACEBOOK_CLIENT_SECRET: optional("FACEBOOK_CLIENT_SECRET"),

  // Email
  EMAIL_PROVIDER: optional("EMAIL_PROVIDER", "resend"),
  EMAIL_API_KEY: required("EMAIL_API_KEY"),
  EMAIL_FROM: optional("EMAIL_FROM", "noreply@wholesaleup.com"),
  EMAIL_REPLY_TO: optional("EMAIL_REPLY_TO", "support@wholesaleup.com"),

  // Rate limiting (optional — falls back to in-memory if not set)
  UPSTASH_REDIS_REST_URL: optional("UPSTASH_REDIS_REST_URL"),
  UPSTASH_REDIS_REST_TOKEN: optional("UPSTASH_REDIS_REST_TOKEN"),

  // Monitoring (optional)
  SENTRY_DSN: optional("SENTRY_DSN"),
  NEXT_PUBLIC_ANALYTICS_ID: optional("NEXT_PUBLIC_ANALYTICS_ID"),

  // Helpers
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};
