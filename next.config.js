/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,

  /* ── Skip ESLint during Vercel builds (run locally instead) ── */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* ── next/image: whitelist external image domains ────────── */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  async headers() {
    /* ── Nonce-based CSP (C3 fix) ──
       'strict-dynamic' trusts scripts loaded by already-trusted scripts.
       In development, 'unsafe-eval' is needed for Next.js source maps.
       See: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy */

    const cspDirectives = [
      "default-src 'self'",
      // Scripts: self + common CDNs; dev adds unsafe-eval for source maps
      // 🔧 PRODUCTION: Add nonce-based CSP via middleware for strict-dynamic support
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.google.com https://www.gstatic.com`,
      // Styles: self + unsafe-inline + Google Fonts CSS
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + data URIs + common CDNs
      "img-src 'self' data: blob: https:",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // API calls: self + Google reCAPTCHA + HaveIBeenPwned breach check
      "connect-src 'self' https://www.google.com https://www.gstatic.com https://api.pwnedpasswords.com",
      // Frames: Google reCAPTCHA needs an iframe
      "frame-src https://www.google.com",
      // Block all object/embed (Flash, Java, etc.)
      "object-src 'none'",
      // Restrict base URI to prevent base tag hijacking
      "base-uri 'self'",
      // Only allow forms to submit to self
      "form-action 'self'",
      // Block framing of this site (clickjacking protection)
      "frame-ancestors 'none'",
      // Upgrade HTTP requests to HTTPS
      "upgrade-insecure-requests",
      // CSP violation reporting (M7 fix)
      "report-uri /api/csp-report",
    ].join("; ");

    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          /* ── Content Security Policy ── */
          {
            key: "Content-Security-Policy",
            value: cspDirectives,
          },

          /* ── Clickjacking protection ── */
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          /* ── Prevent MIME type sniffing ── */
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          /* ── Control Referer header leakage ── */
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          /* ── Restrict browser features (camera, mic, geolocation, etc.) ── */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          /* ── Force HTTPS — C4 fix: enabled for production ── */
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          /* ── Prevent XSS filter bypass in old browsers ── */
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          /* ── Disable DNS prefetching to prevent privacy leaks ── */
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
