# WholesaleUp — Project Architecture

> **Last updated:** 2026-03-07
> **Purpose:** Single source of truth for Claude sessions. Read this first in every new session.

## Tech Stack

- **Framework:** Next.js 15.5.12 (App Router) + React 19
- **Language:** TypeScript + JSX (components are .jsx, pages are .tsx)
- **Styling:** Tailwind CSS 3.4.16 (DM Sans + Outfit fonts)
- **Database:** PostgreSQL via Prisma 7.4.2
- **Auth:** NextAuth v5 (beta.30) with Prisma adapter
- **Rate Limiting:** Upstash Redis (@upstash/ratelimit + @upstash/redis)
- **Email:** Abstraction layer supporting Resend, SendGrid, AWS SES
- **Icons:** Lucide React 0.468.0
- **Maps:** d3-geo 3.1.1
- **Utilities:** class-variance-authority, bcryptjs

## Project Structure

```
/src
├── /app                    ← Next.js App Router pages + API routes
│   ├── /api                ← 21 API endpoints (auth, data, user, utility)
│   ├── /dashboard          ← Authenticated dashboard pages
│   │   ├── /account-access
│   │   ├── /account-profile
│   │   ├── /buyer-profile
│   │   └── /newsletters
│   ├── layout.tsx          ← Root layout (providers, fonts, metadata)
│   ├── page.tsx            ← Landing page
│   └── sitemap.ts          ← Dynamic sitemap
├── /components
│   ├── /phases             ← 21 page-level components (the UI)
│   └── /shared             ← 20 reusable components + hooks
├── /lib                    ← Core utilities (db, email, env, rate-limit)
├── /generated/prisma       ← Auto-generated Prisma client
├── /types                  ← TypeScript augmentations (next-auth.d.ts)
├── /data                   ← Static data files
├── /email-templates        ← HTML email templates
├── auth.js                 ← NextAuth full config (Node runtime)
├── auth.config.js          ← NextAuth edge-safe config
└── middleware.ts            ← Edge middleware (staging gate)
```

## Architecture Pattern

**Phase-based component architecture:** Each major page section is a self-contained "phase" component in `/src/components/phases/`. The thin page.tsx files in `/src/app/` simply import and render these phase components. This keeps routing separate from UI logic.

**Layout hierarchy:**
1. `layout.tsx` — root (providers, fonts, body)
2. `app-layout.jsx` — production shell (dark blue sidebar, header, hamburger, search, footer)
3. `shell.jsx` — demo shell (duplicate of app-layout, used at /shell route only)

**Key architectural note:** `app-layout.jsx` is the REAL production layout wrapper. `shell.jsx` is a demo copy. Changes to navigation, header, sidebar must go in `app-layout.jsx`.

## Responsive Breakpoint Strategy

| Breakpoint | Width   | What happens                                    |
|------------|---------|------------------------------------------------|
| < sm       | < 640px | Title/Name rows stack, minimal padding          |
| < md       | < 768px | AccountSidebar hidden, MobileDashboardNav shown |
| md–xl      | 768–1279px | AccountSidebar force-collapsed (icons only)  |
| < xl       | < 1280px | Dark blue nav hidden, hamburger shown          |
| xl+        | ≥ 1280px | Full layout: dark blue nav + expanded sidebar  |
| < 2xl      | < 1536px | Tips panels hidden                             |
| 2xl+       | ≥ 1536px | Tips panels visible (fixed w-72)               |

## Authentication Flow

- **Providers:** Credentials (email/username + password), Google, Apple, Facebook (OAuth)
- **Session:** JWT strategy, 30-day default, 90-day with "Remember Me"
- **Tier system:** FREE → STANDARD → PREMIUM → PREMIUM+ / SUPPLIER PRO
- **Demo mode:** `useDemoAuth()` context provides mock users for development
- **Protected routes:** Dashboard pages require authentication
- **Middleware:** Optional staging gate via SITE_PASSWORD env var

## Database Schema (Prisma)

**Models:** User, Account, Session, VerificationToken, LoginHistory
- User: email, username, password (bcrypt), tier, tierExpiresAt, newsletter flag
- Account: OAuth provider linking (Google/Apple/Facebook)
- Session: JWT-based with revocation capability
- VerificationToken: Email verification + password reset (type field)
- LoginHistory: IP, user agent, success tracking

## API Routes Summary

**Auth (7):** register, check-email, check-username, verify-email, send-verification, forgot-password, nextauth catch-all
**Data (8):** categories, deals, deals/[id], suppliers, suppliers/[id], testimonials, pricing, stats
**User (3):** profile, save-deal, saved-deals
**Utility (3):** contact, verify-recaptcha, csp-report

## Environment Variables

Required: DATABASE_URL, AUTH_SECRET, AUTH_URL
Optional: OAuth client IDs/secrets, email service keys (RESEND/SENDGRID/SES), UPSTASH_REDIS_REST_URL/TOKEN, RECAPTCHA keys, SITE_PASSWORD

See `.env.example` for full list with documentation.
