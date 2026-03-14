# WholesaleUp — Infrastructure & Services

> **Last updated:** 2026-03-07
> **Purpose:** Track all external services, deployment config, and infrastructure decisions.

## Deployment Target

**Platform:** TBD (Vercel recommended for Next.js 15 App Router)
**Region:** TBD (likely eu-west for UK wholesale market)

## External Services

### Database — PostgreSQL
- **Provider:** TBD (Neon, Supabase, AWS RDS, or Railway)
- **ORM:** Prisma 7.4.2
- **Connection:** DATABASE_URL env var
- **Status:** Schema defined, local dev via docker or hosted

### Authentication — NextAuth v5
- **Session strategy:** JWT (30-day default, 90-day with Remember Me)
- **Credentials:** Email/username + bcrypt password
- **OAuth providers (optional):**
  - Google: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - Apple: APPLE_ID, APPLE_SECRET
  - Facebook: FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
- **Config:** AUTH_SECRET, AUTH_URL (NEXTAUTH_URL)

### Email Service
- **Abstraction:** `/src/lib/email.js` supports multiple providers
- **Supported providers:**
  - Resend (RESEND_API_KEY) — recommended for dev/small scale
  - SendGrid (SENDGRID_API_KEY)
  - AWS SES (AWS_SES_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
- **From address:** EMAIL_FROM env var
- **Templates:** `/src/email-templates/verification.html`
- **Used for:** Email verification, password reset, contact form notifications

### Rate Limiting
- **Provider:** Upstash Redis
- **Config:** UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
- **Fallback:** In-memory rate limiter when Redis not configured
- **Applied to:** Auth endpoints (register, login, forgot-password, send-verification)

### reCAPTCHA
- **Version:** v3 (invisible)
- **Config:** NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY
- **Applied to:** Registration, contact form

### Content Security Policy
- **Reporting:** POST /api/csp-report endpoint
- **Headers:** Configured in next.config.js

## AWS Services (Planned)

| Service | Purpose | Status |
|---------|---------|--------|
| S3 | Image/file storage (avatars, deal images, supplier logos) | NOT STARTED |
| CloudFront | CDN for S3 assets | NOT STARTED |
| SES | Transactional email (production) | CONFIGURED in email.js |
| Route 53 | DNS management | NOT STARTED |
| RDS | PostgreSQL database (production) | NOT STARTED |
| WAF | Web application firewall | NOT STARTED |

## Image Handling

**Current:** Images referenced as paths/URLs in components, mostly placeholder/demo
**Planned:**
- Upload to S3 via signed URLs
- Serve via CloudFront CDN
- Resize/optimize via Next.js Image component (already used in some places)
- Avatar upload: SidebarAvatarUpload component exists in dashboard.jsx (UI only)

## Security Headers (next.config.js)

- Strict-Transport-Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (camera, microphone, geolocation disabled)
- Content-Security-Policy with nonce-based scripts

## Environment Variables Checklist

### Required
- [ ] DATABASE_URL — PostgreSQL connection string
- [ ] AUTH_SECRET — NextAuth signing secret
- [ ] AUTH_URL — Site URL for auth callbacks

### Recommended
- [ ] EMAIL_FROM — Sender email address
- [ ] At least one email provider key (RESEND_API_KEY recommended for dev)
- [ ] NEXT_PUBLIC_RECAPTCHA_SITE_KEY + RECAPTCHA_SECRET_KEY

### Optional
- [ ] UPSTASH_REDIS_REST_URL + TOKEN (rate limiting)
- [ ] OAuth provider keys (Google, Apple, Facebook)
- [ ] SITE_PASSWORD (staging protection)
- [ ] AWS keys (when S3/SES/CloudFront needed)

## Backend Admin Panel

**Status:** NOT STARTED
**Planned features:**
- [ ] User management (view/edit users, tiers, bans)
- [ ] Deal management (CRUD, approval, featuring)
- [ ] Supplier management (verification, profiles)
- [ ] Category management (tree editor)
- [ ] Contact submissions (inbox, status tracking)
- [ ] Review moderation (approve/reject)
- [ ] Platform stats dashboard
- [ ] Newsletter management
- [ ] Pricing plan configuration

**Approach TBD:** Custom admin pages under /admin route, or external tool (e.g., AdminJS, Retool)
