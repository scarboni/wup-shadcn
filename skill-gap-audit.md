# WholesaleUp Skill Gap Audit

**Date:** 2026-03-14
**Scope:** Frontend design, backend design, database design, DB integration, deployment

---

## Current Coverage (26 skills)

The existing skills cover **frontend UI patterns** thoroughly — supplier cards, deal cards, deal pages, supplier profiles, categories, countries, URL formats, SEO, Open Graph, cookies, form standards, account types, demo dropdown, name visibility, and website click limits. The `production-standards` skill acts as a catch-all migration guide but is now 1,100+ lines and covers too many concerns in one file.

**Document creation skills** (docx, pptx, xlsx, pdf) and **meta skills** (skill-creator, skill-packaging, schedule) are complete and don't need changes.

---

## Missing Skills — Prioritised by Impact

### TIER 1 — CRITICAL (blocks production deployment)

#### 1. `auth-system`
**Gap:** No skill documenting the authentication architecture. The codebase has NextAuth v5 with Google/Apple/Facebook OAuth + Credentials provider, edge-safe middleware split (`auth.config.js` + `auth.js`), 7 auth API routes, email verification flow, password reset, and the demo-auth → real-auth migration. The `production-standards` skill mentions auth in Phases 2-3 but doesn't define the canonical patterns, session shape, JWT strategy, or the `openRegisterModal`/`open-auth-modal` CustomEvent bridge.

**Should cover:**
- NextAuth v5 config (providers, adapter, callbacks, session strategy)
- Edge middleware (`middleware.ts`) — route protection rules, which routes are public vs protected
- Session shape (user.id, user.role, user.tier, user.email, etc.)
- `auth-modal.jsx` / `auth-ui.jsx` — the modal login/register system
- `openRegisterModal()` CustomEvent pattern (used sitewide for Guest CTAs)
- Auth API routes: register, check-email, check-username, verify-email, forgot-password, send-verification
- OAuth flow (Google, Apple, Facebook) + email/password credentials
- Demo-auth → real-auth migration mapping
- Hooks: `use-breach-check`, `use-email-check`, `use-username-check`, `use-verification-email`

**Files involved:** `src/auth.js`, `src/auth.config.js`, `src/middleware.ts`, `src/components/shared/auth-modal.jsx`, `auth-ui.jsx`, `auth-provider.jsx`, `src/app/api/auth/**`, `src/components/shared/demo-auth-context.jsx`

---

#### 2. `database-schema`
**Gap:** No skill documenting the database structure. The Prisma schema file exists but is empty (0 lines). The `production-standards` skill describes table relationships at a high level (User → AccountProfile, BuyerProfile, SupplierProfile) but there's no canonical schema definition that covers all tables, columns, types, indexes, constraints, and relationships. Without this, any developer building API routes or writing queries is guessing.

**Should cover:**
- All tables: Users, AccountProfile, BuyerProfile, SupplierProfile, Deals, Suppliers, Categories, Testimonials, WebsiteClickLog, VerificationTokens, Sessions, Accounts (OAuth)
- Column definitions with types, nullable, defaults, constraints
- Relationships and foreign keys (1:1, 1:many, many:many)
- Indexes for search/filter performance (especially deals and suppliers listing pages)
- The buyer↔supplier cross-matching field keys
- Prisma schema conventions (client generation, enum usage)
- Seed script structure (`prisma/seed.ts`)
- Migration workflow (prisma migrate dev → prisma db push)

**Files involved:** `prisma/schema.prisma` (currently empty), `prisma/seed.ts`, `src/lib/db.js`, `src/generated/prisma/`

---

#### 3. `api-routes`
**Gap:** No skill defining the API route architecture, request/response contracts, or error handling patterns. The codebase has 22+ API routes across auth, deals, suppliers, user data, and public data, but their request/response shapes, validation rules, pagination patterns, and error codes aren't documented anywhere as a unified reference. The `production-standards` skill lists routes that need building but doesn't define the actual contracts.

**Should cover:**
- Route naming conventions (`/api/auth/*`, `/api/deals/*`, `/api/suppliers/*`, `/api/user/*`)
- Request/response shapes for each endpoint (TypeScript interfaces)
- Pagination pattern (cursor vs offset, page size, response envelope)
- Error response format (`{ error: string, code: string, details?: object }`)
- Auth middleware pattern (session validation, tier checks)
- Rate limiting integration (`src/lib/rate-limit.js` via Upstash)
- CORS, CSP, and security headers
- The `/go` redirect route contract (already documented in `website-click-limits` but should be cross-referenced)
- Server-side validation rules per endpoint

**Files involved:** `src/app/api/**`, `src/lib/rate-limit.js`, `src/middleware.ts`

---

### TIER 2 — HIGH (needed before connecting frontend to backend)

#### 4. `dashboard-pages`
**Gap:** No skill documenting the dashboard system. There are 7 dashboard pages (home, account-access, account-profile, add-deal, buyer-profile, newsletters, supplier-profile) with navigation via `src/lib/dashboard-nav.js`, error/loading states, and complex forms. The `supplier-profile` skill covers one form, but the overall dashboard architecture, navigation system, shared layout, and the account-profile / buyer-profile forms have no skill.

**Should cover:**
- Dashboard layout and navigation (`dashboard-nav.js`)
- Route protection (all `/dashboard/*` routes require auth)
- Account Profile form — fields, tabs, validation (from `account-profile.jsx`)
- Buyer Profile form — fields, validation, cross-matching with supplier data (from `buyer-profile.jsx`)
- Add Deal form — upload flow entry point (from `deal-form.jsx`)
- Newsletters page — subscription management
- Dashboard home — overview widgets, stats
- Shared form infrastructure: `use-form-draft`, `use-profile-save-time`, `stale-profile-banner`

**Files involved:** `src/app/dashboard/**`, `src/components/phases/dashboard.jsx`, `account-profile.jsx`, `buyer-profile.jsx`, `deal-form.jsx`, `newsletters.jsx`, `src/lib/dashboard-nav.js`

---

#### 5. `email-system`
**Gap:** No skill documenting the email architecture. The codebase has `src/lib/email.js` (email sending utility), `src/email-templates/verification.html`, and multiple API routes that send emails (verify-email, forgot-password, send-verification, contact form). There's no documentation of the email service integration, template conventions, or transactional email types.

**Should cover:**
- Email service provider integration (SendGrid/Resend — referenced in production-standards env vars)
- Email utility (`src/lib/email.js`) — how emails are sent
- Template conventions (HTML templates in `src/email-templates/`)
- Transactional email types: verification, password reset, contact form receipt, newsletter subscription
- Email content guidelines (branding, footer, unsubscribe)
- Rate limiting on email-sending endpoints
- Production env vars: `EMAIL_FROM`, `RESEND_API_KEY` or `SENDGRID_API_KEY`

**Files involved:** `src/lib/email.js`, `src/email-templates/**`, `src/app/api/auth/verify-email/route.js`, `src/app/api/auth/forgot-password/route.js`, `src/app/api/contact/route.js`

---

#### 6. `enquiry-messaging`
**Gap:** No skill documenting the contact/enquiry system. The `ContactSupplierModal` component exists, "Send Enquiry" buttons are on every supplier card and deal page, and enquiry access is gated by tier — but there's no documentation of the enquiry flow, message storage, notification system, or how enquiries connect to the supplier dashboard.

**Should cover:**
- Contact modal (`src/components/shared/contact-modal.jsx`) — fields, validation, submission
- Enquiry gating rules (which tiers can send to which suppliers)
- Enquiry storage (database table, fields, status tracking)
- Supplier notification on new enquiry
- Enquiry history for buyers and suppliers
- The "Contact Now" button on supplier sidebar and its relationship to enquiry flow
- Future: in-platform messaging system

**Files involved:** `src/components/shared/contact-modal.jsx`, supplier sidebar, supplier cards, deal pages

---

### TIER 3 — MEDIUM (needed before deployment)

#### 7. `deployment-infrastructure`
**Gap:** No skill documenting hosting, CI/CD, environment management, or deployment procedures. The `production-standards` skill mentions environment variables and a migration order, but there's no documentation of where/how the app is hosted, how deployments are triggered, environment promotion (dev → staging → production), or monitoring.

**Should cover:**
- Hosting platform (Vercel, AWS, etc.)
- Environment management (dev, staging, production)
- Environment variable management (which vars are needed per environment)
- CI/CD pipeline (build, test, deploy triggers)
- Database hosting and connection (PostgreSQL provider)
- Redis/Upstash for rate limiting
- CDN and static asset handling
- Domain and DNS configuration
- SSL/TLS
- Monitoring and alerting (error tracking, uptime)
- Rollback procedures

---

#### 8. `design-system`
**Gap:** No skill documenting the visual design system — colours, typography, spacing, component conventions. The project uses Tailwind with specific colour values (e.g. `#1e5299` for Pro blue, `bg-orange-500` for CTAs) and consistent component patterns, but these are only documented implicitly in the card skills. A developer adding a new page has no reference for which colours, font sizes, or spacing values to use.

**Should cover:**
- Brand colours: primary blue (`#1e5299`), CTA orange (`orange-500`), success green, warning, error
- Typography: heading sizes, body text, caption text
- Spacing conventions: padding/margin patterns
- Border radius conventions (rounded-lg, rounded-xl)
- Shadow conventions
- Button styles: primary (blue), secondary (orange outline), danger
- Badge/tag colour coding: supplier type (rose), supply model (slate+emerald), category (emerald), quality tier (orange)
- Icon sizing conventions per context
- Responsive breakpoints and how mobile differs

---

#### 9. `search-filter-system`
**Gap:** The `url-formats` skill documents query parameter names, and `filters.jsx` exists with complex filter UI, but there's no skill for the search and filter system as a whole — how keyword search works, how filters compose, how broad-match vs exact-match works, how pagination integrates, or how the filter sidebar interacts with URL state.

**Should cover:**
- Keyword search: `any` (broad), `all` (AND), `exact` (phrase) modes
- Filter categories: countries, grades, price ranges, buyer types, supply models, etc.
- Filter UI: collapsible sidebar panels, active filter chips, clear all
- URL ↔ state synchronisation (searchParams → filter state → URL push)
- Broad-match separator component and "more results" pattern
- Pagination: page size, URL params, server-side vs client-side
- Sort options: relevance, newest, price, rating
- Applied filters badge count

**Files involved:** `src/components/phases/filters.jsx`, `src/components/shared/collapsible-filter-panel.jsx`, `src/components/shared/broad-match-separator.jsx`, suppliers.jsx, deals pages

---

### TIER 4 — LOW (nice to have, helps long-term maintenance)

#### 10. `shared-components`
**Gap:** 27+ shared components exist but aren't documented as a group. Components like `app-layout.jsx`, `breadcrumb.jsx`, `cta-banner.jsx`, `loading-spinner.jsx`, `star-rating.jsx`, `verified-badge.jsx`, `logo.jsx`, `back-to-top.jsx`, and `dot-world-map.jsx` have no skill documenting their props, usage patterns, or where they're used.

#### 11. `pricing-subscription`
**Gap:** The pricing page exists (`pricing.jsx`, `pricing-data.js`) and account types are documented, but there's no skill covering the Stripe integration, subscription lifecycle, upgrade/downgrade flow, billing webhooks, or how tier changes propagate to the user session.

#### 12. `notification-system`
**Gap:** No skill for user notifications — email alerts for new deals matching filters, supplier newsletter subscriptions, enquiry responses, etc. The newsletters page exists in the dashboard but the notification architecture isn't documented.

---

## Existing Skill That Needs Splitting

### `production-standards` (1,100+ lines)
This skill has grown into a catch-all covering security, API routes, environment variables, demo migration patterns, infrastructure, database seeding, profile pages, and a pre-launch checklist. It should be **split** into the proposed skills above, with `production-standards` trimmed to just the migration order and pre-launch checklist. Sections 2 (API Routes), 3 (Environment Variables), 8 (Database Seeding), and 10 (Profile Pages) should move to their respective new skills.

---

## Recommended Creation Order

| Priority | Skill | Why First |
|----------|-------|-----------|
| 1 | `database-schema` | Everything else depends on it |
| 2 | `auth-system` | Required before any protected feature works |
| 3 | `api-routes` | Defines the contract between frontend and backend |
| 4 | `dashboard-pages` | Largest undocumented frontend surface |
| 5 | `email-system` | Required for auth flows (verification, password reset) |
| 6 | `enquiry-messaging` | Core business feature, undocumented |
| 7 | `design-system` | Prevents visual inconsistency as pages are added |
| 8 | `deployment-infrastructure` | Required before going live |
| 9 | `search-filter-system` | Complex system, easy to break |
| 10-12 | shared-components, pricing, notifications | Nice to have |
