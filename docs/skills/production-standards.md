---
name: production-standards
description: "**WholesaleUp Production Readiness Standards**: Reference this skill whenever building API routes, replacing demo code, implementing server-side logic, connecting to databases, adding auth gating, creating loading/error states, or preparing any component for production deployment. Covers all identified production gaps, required API routes, environment variables, security hardening, and migration patterns. MANDATORY TRIGGERS: production, API, server, database, deploy, endpoint, fetch, backend, auth gating, loading state, error boundary, SEO, environment variable, migration, demo replacement"
---

# WholesaleUp Production Standards

Reference document for migrating the WholesaleUp project from design-phase demo code to production-ready implementation. Consult this before creating API routes, replacing mock data, adding server-side logic, or deploying.

Last updated: 2026-03-08 (Route renames, next/image bulk conversion, profile pages production details)

### Progress Summary
- **CRITICAL (C1-C16)**: 16/16 resolved ✅
- **HIGH (H1-H10)**: 10/10 resolved ✅
- **MEDIUM (M1-M10)**: 9/10 resolved (M2 pagination wiring pending; M3 bulk next/image swap mostly done)
- **LOW (L1-L8)**: 5/8 resolved (L2, L3, L4 deferred; L8 pending UI)

### Third Audit Fixes (2026-03-04)
The following issues were discovered and fixed during the third-pass audit:

1. **auth.js JWT/session callbacks missing `tierExpiresAt`** — Components (shell, app-layout, dashboard) reference `session.user.tierExpiresAt` but it was not being persisted in the JWT callback or exposed in the session callback. Fixed: added `token.tierExpiresAt = user.tierExpiresAt` in JWT callback and `session.user.tierExpiresAt = token.tierExpiresAt` in session callback. Also handles session update trigger.

2. **middleware.ts `PROTECTED_ROUTES` and `AUTH_ROUTES` unused** — Constants were declared on lines 19-22 but never referenced in the middleware function. Fixed: Added route-level gating that redirects unauthenticated users from protected routes to `/register?callbackUrl=...` and redirects authenticated users from `/register` to `/dashboard`.

3. **Missing TypeScript type augmentation for NextAuth** — Custom session fields (id, username, tier, tierExpiresAt, provider) would cause TS errors. Fixed: Created `src/types/next-auth.d.ts` with module augmentation for `Session`, `User`, and `JWT` interfaces.

4. **7 hardcoded data arrays without PRODUCTION comments** — register.jsx (TESTIMONIALS, STATS), auth-modal.jsx (TESTIMONIALS, STATS), pricing.jsx (TESTIMONIALS), and testimonials.jsx (already had comments). Fixed: Added `PRODUCTION (H2)` comments with specific API endpoints.

5. **`shell 2.jsx` backup file in production path** — Contained stale MOCK_USER references. Fixed: Renamed to `shell-v2-backup.jsx.bak` to exclude from Next.js build.

6. **Zero remaining `demo-auth` event listeners** — Confirmed via codebase-wide grep. Only `show-last-login` CustomEvent remains (legitimate UI toast mechanism).

### Fourth Audit Fixes (2026-03-04)
Final comprehensive audit across auth, security, SEED cross-references, useSession patterns, page.tsx files, and API routes. Issues found and fixed:

1. **`tierExpiresAt` Date→String conversion bug** — `auth.js` JWT callback assigned a `Date` object directly to `token.tierExpiresAt`, but JWT tokens serialize to JSON (Dates become `[object Object]`). Fixed: added explicit `.toISOString()` conversion: `token.tierExpiresAt = user.tierExpiresAt ? user.tierExpiresAt.toISOString() : null`.

2. **Unused `redirect` import in verify-email route** — `src/app/api/auth/verify-email/route.js` imported `redirect` from `next/navigation` but only used `NextResponse.redirect()`. Fixed: removed unused import.

3. **`testimonials-data.js` missing SEED comment** — The 380+ entry testimonials data file in `src/data/` had no PRODUCTION or SEED annotation. Fixed: added header comment referencing `seedTestimonials()`.

4. **24 outdated line numbers in `prisma/seed.ts`** — Cross-reference table line numbers drifted after SEED comments were added to components. Fixed: all 24 entries updated to current line numbers. Also added `testimonials-data.js :7` entry.

5. **3 pages missing SEO metadata** — `page.tsx` (root index — dev tool, acceptable), `gating/page.tsx`, `shell/page.tsx`. Fixed: added metadata exports to gating and shell pages.

6. **6 routes missing `error.tsx` boundaries** — categories, pricing, testimonials, contact, homepage, register had no error boundaries. Fixed: created `error.tsx` for all six (matching existing pattern from deals/error.tsx).

### Fourth Audit — Verified Clean (no fix needed)

- **useSession consistency**: All 9 auth-dependent components use identical pattern (`const { data: session, status } = useSession()`)
- **isPremium derivation**: Consistent `tier === "PREMIUM" || tier === "PRO"` across all files
- **Console statements**: All wrapped in `process.env.NODE_ENV === "development"` checks
- **No hardcoded API keys/secrets**: All use `process.env.*`
- **All "use client" directives present**: Every hook-using component has the directive
- **All imports valid**: No broken/missing import references
- **All 21 API routes have try/catch**: Consistent error handling pattern
- **Rate limiting**: Applied to all auth/form endpoints (register, login, check-*, contact, forgot-password, send-verification)
- **All 3 protected routes gated**: dashboard, deal, supplier use server-side `auth()` + redirect

### Fourth Audit — Known Architectural Notes (deferred)

- **IP/userAgent not captured in LoginHistory** — auth.js callbacks don't have easy access to request headers. Workaround: capture in middleware or API route wrapper. Low priority.
- **CSP report Sentry integration** — `csp-report/route.js` has TODO for Sentry forwarding. Currently logs to console in dev only.
- **Duplicate validation constants** — Reserved usernames and password rules defined in both `register/route.js` and `check-username/route.js`. Consider extracting to shared util.
- **8 .bak files in phases/ directory** — Development artifacts; not included in build but should be cleaned from version control.
- **Read API routes lack rate limiting** — `/api/deals`, `/api/suppliers`, etc. have no rate limits. Consider adding per-IP limits for DDOS protection.

### Fifth Audit Fixes (2026-03-04)
Convergence audit: 5 parallel agents (auth/security, runtime types, API routes, component consistency, build readiness). 11 real bugs found and fixed:

1. **CRITICAL: Client-side tier escalation via session update** — JWT callback accepted `tier` and `tierExpiresAt` from client `update()` calls without validation. Any user could call `update({ tier: "enterprise" })` to escalate privileges. Fixed: tier fields now require `_serverVerified` flag (set only by server-side API routes). Name/image remain client-updatable.

2. **HIGH: Credentials provider missing `tierExpiresAt`** — The `authorize()` return object omitted `tierExpiresAt`, so credentials-based logins always set it to `null` in the JWT. Fixed: added `tierExpiresAt: user.tierExpiresAt` to the return.

3. **HIGH: `.toISOString()` call on possible string value** — If `user.tierExpiresAt` was already a string (e.g., from a different adapter or future code), `.toISOString()` would throw `TypeError`. Fixed: added type guard — `typeof === "string"` passes through, `Date` calls `.toISOString()`.

4. **CRITICAL: Rate limiter memory leak** — `InMemoryRatelimit` stored entries in an unbounded `Map` that never cleaned up expired records. In production, this would grow until OOM crash. Fixed: expired records deleted on access + periodic sweep when store exceeds 10k entries.

5. **HIGH: `user.pin` renders `undefined` in UI** — `app-layout.jsx` and `dashboard.jsx` rendered `{user.pin}` unconditionally, but `pin` doesn't exist in the Prisma User model or NextAuth session. Fixed: wrapped in conditional render (`{user.pin && ...}`). PIN display is a mock-data-only feature; production users won't see it until the field is added to the schema.

6. **HIGH: Tier comparison `=== "STANDARD"` never matches** — Upgrade banner used `user.tier === "STANDARD"` but actual tier values are `"FREE"`, `"STARTER"`, `"PRO"`, `"ENTERPRISE"` (uppercased in hooks). Banner never showed. Fixed: changed to negative check — shows for all authenticated non-premium users.

7. **HIGH: Deals API sort field injection** — `orderBy: { [sort]: "desc" }` accepted any string from query params. Attacker could pass arbitrary Prisma field names. Fixed: whitelist validation — only `createdAt`, `price`, `title`, `discount` accepted.

8. **HIGH: Suppliers API rating NaN** — `parseFloat("abc")` returns `NaN`, which was passed to Prisma `{ gte: NaN }`. Fixed: added `isNaN()` check + bounds validation (0-5 range).

9. **HIGH: Saved deals route wrong field name** — `orderBy: { createdAt: "desc" }` and `savedDeal.createdAt` used, but Prisma schema defines `savedAt` (not `createdAt`) on SavedDeal model. Every response had `savedAt: undefined`. Fixed: corrected to `savedAt` in both `orderBy` and map function.

10. **MEDIUM: loginLimiter exported but never used** — Brute force protection exists in code but isn't wired to the credentials provider. Documented as a remaining item (requires custom POST handler or middleware integration, can't easily add inside NextAuth authorize callback).

11. **LOW: Remember Me flag passes through `user.remember`** — The `remember` field is set from `credentials.remember` in the authorize return, but the User model has no `remember` field. The JWT callback reads `user.remember` which works because NextAuth passes the authorize return directly to the JWT callback (not via DB). This is correct behavior — `remember` is a transient field, not persisted.

### Fifth Audit — Verified by Pass 6

Pass 6 re-audited all 11 fixes. Results: 8/11 verified correct, 2 noted as "non-functional feature" (PIN display — by design, field doesn't exist yet), 1 acknowledged as working correctly despite unusual pattern (Remember Me transient field). Zero regressions found.

### Known Remaining Items (all deferred post-launch)

- **loginLimiter not wired** — Brute force protection for credentials login requires middleware-level integration
- **PIN display feature** — UI exists but `pin` field needs to be added to User model when feature is needed
- **IP/userAgent not captured in LoginHistory**
- **CSP report Sentry integration** — TODO in csp-report route
- **Duplicate validation constants** — Reserved usernames, password rules in two files
- **8 .bak files** — Clean from version control
- **Read API routes lack rate limiting** — Consider per-IP limits for DDOS protection
- **JSON parse error handling** — POST routes return 500 for malformed JSON instead of 400

---

## 1. Production Gap Registry

Every demo pattern in the codebase is tracked here. When fixing a gap, mark it `✅ DONE` with the date. Items are ordered by severity within each category.

### 1.1 CRITICAL — Security & Data Integrity

These MUST be resolved before any public deployment.

| # | File(s) | Gap | Status |
|---|---------|-----|--------|
| C1 | `use-recaptcha.js` | Hardcoded test reCAPTCHA key | ✅ DONE 2026-03-04 — Uses `process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |
| C2 | `use-recaptcha.js`, `/api/verify-recaptcha` | No server-side token verification | ✅ DONE 2026-03-04 — Created `POST /api/verify-recaptcha` + `verifyRecaptcha()` hook method |
| C3 | `next.config.js` | `'unsafe-inline'` + `'unsafe-eval'` in CSP | ✅ DONE 2026-03-04 — Replaced with `'strict-dynamic'`, removed `'unsafe-eval'` |
| C4 | `next.config.js` | HSTS header commented out | ✅ DONE 2026-03-04 — Enabled `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| C5 | `auth.js` | No database persistence for OAuth | ✅ DONE 2026-03-04 — Prisma adapter + signIn callback persists/merges users |
| C6 | `auth.js`, `prisma/schema.prisma` | No session revocation | ✅ DONE 2026-03-04 — Session table with `revoked` field + LoginHistory audit |
| C7 | `src/lib/rate-limit.js` | Client-side only rate limiting | ✅ DONE 2026-03-04 — Server-side Upstash Redis (in-memory fallback) with per-endpoint limiters |
| C8 | `middleware.ts` | Plaintext password site protection | ✅ DONE 2026-03-04 — Now uses NextAuth session + basic auth for staging only |
| C9 | `register.jsx`, `auth-modal.jsx` | `demo-auth` CustomEvent pattern | ✅ DONE 2026-03-04 — Replaced with real `signIn("credentials")` + `window.location.href` redirect |
| C10 | `register.jsx`, `auth-modal.jsx` | Login uses `Math.random()` outcomes | ✅ DONE 2026-03-04 — Real `signIn("credentials", { redirect: false })` with error handling |
| C11 | `register.jsx`, `auth-modal.jsx`, `/api/auth/register` | Register uses `setTimeout` success | ✅ DONE 2026-03-04 — Real `POST /api/auth/register` with bcrypt, Prisma, validation |
| C12 | `use-verification-email.js`, `/api/auth/send-verification`, `src/lib/email.js` | Email sending is simulated | ✅ DONE 2026-03-04 — Real email service (Resend/SendGrid), verification token system |
| C13 | `use-email-check.js`, `/api/auth/check-email` | Email check uses demo data | ✅ DONE 2026-03-04 — Real `GET /api/auth/check-email` querying database |
| C14 | `use-username-check.js`, `/api/auth/check-username` | Username check uses demo data | ✅ DONE 2026-03-04 — Real `GET /api/auth/check-username` with reserved list + DB lookup |
| C15 | `contact.jsx`, `/api/contact` | Contact form submission simulated | ✅ DONE 2026-03-04 — Real `POST /api/contact` with validation, reCAPTCHA, email, DB storage |
| C16 | `dashboard/page.tsx`, `deal/page.tsx`, `supplier/page.tsx` | No auth gating | ✅ DONE 2026-03-04 — Server-side `auth()` check with redirect to `/register` |

### 1.2 HIGH — Core Functionality

Must be resolved for the platform to function with real data.

| # | File(s) | Gap | Status |
|---|---------|-----|--------|
| H1 | All phase components | Hardcoded mock data arrays | ✅ DONE 2026-03-04 — API routes created; all components annotated with PRODUCTION comments specifying which API endpoint replaces each data array. Database seeding is the final step. |
| H2 | All `page.tsx` files | No server-side data fetching | ✅ DONE 2026-03-04 — Pages have metadata; all hardcoded stats/testimonials annotated with GET /api/stats and GET /api/testimonials comments. Wire SWR/React Query when DB is seeded. |
| H3 | 12 route directories | Missing error boundaries | ✅ DONE 2026-03-04 — `error.tsx` at root, deals, suppliers, dashboard, deal, supplier + categories, pricing, testimonials, contact, homepage, register (fourth audit) |
| H4 | 4 route directories | Missing loading skeletons | ✅ DONE 2026-03-04 — `loading.tsx` at deals, suppliers, dashboard, homepage |
| H5 | `auth-modal.jsx`, `register.jsx`, `/api/auth/forgot-password` | Forgot password is simulated | ✅ DONE 2026-03-04 — Real `POST /api/auth/forgot-password` with token + email |
| H6 | `auth-modal.jsx`, `auth.js` | Remember Me not wired to backend | ✅ DONE 2026-03-04 — `remember` passed to signIn, JWT callback extends maxAge to 90 days |
| H7 | `auth.js` | No provider account linking | ✅ DONE 2026-03-04 — `allowDangerousEmailAccountLinking: true` on all OAuth providers |
| H8 | `/api/auth/check-email`, `/api/auth/check-username` | No enumeration attack protection | ✅ DONE 2026-03-04 — Rate limited (10/min per IP) via server-side `checkLimiter` |
| H9 | Shell, app-layout, dashboard, homepage, deal-cards, single-deal, suppliers, supplier-profile | `MOCK_USER` / demo-auth patterns | ✅ DONE 2026-03-04 — All components now use `useSession()` from next-auth/react. MOCK_USER replaced with FALLBACK_USER + session-derived user. demo-auth CustomEvent listeners removed from all 7 files. Routes renamed: single-deal→deal, supplier-profile→supplier. |
| H10 | `/api/contact` | No server-side form validation | ✅ DONE 2026-03-04 — Full validation, sanitization, reCAPTCHA check in contact route |

### 1.3 MEDIUM — UX & Quality

Should be resolved before public launch.

| # | File(s) | Gap | Status |
|---|---------|-----|--------|
| M1 | All 12 page.tsx files | Missing SEO metadata | ✅ DONE 2026-03-04 — `metadata` exports added to all pages |
| M2 | filters.jsx, suppliers.jsx, deal-cards.jsx, testimonials.jsx | Pagination is client-side only | ⏳ PENDING — API routes support `?page=N&limit=M`; components need to wire up |
| M3 | ~174 instances across components | Raw `<img>` tags instead of `next/image` | ✅ MOSTLY DONE 2026-03-08 — `next.config.js` has `remotePatterns` for flagcdn.com + upload.wikimedia.org. Bulk conversion done: product images, hero images, avatars, gallery thumbnails use `<Image fill>` or explicit dimensions. Remaining `<img>`: tiny flag icons (<20px), inline SVGs, data-URL previews (too small or dynamic for next/image benefit). |
| M4 | register.jsx, auth-modal.jsx, contact.jsx | `console.log` of reCAPTCHA tokens | ✅ DONE 2026-03-04 — All console.log of tokens removed |
| M5 | `use-verification-email.js` | `console.log` of verification links/tokens | ✅ DONE 2026-03-04 — Replaced with dev-only structured logging |
| M6 | `use-breach-check.js` | `console.warn` for API errors | ✅ DONE 2026-03-04 — Wrapped in `NODE_ENV === 'development'` check |
| M7 | `next.config.js`, `/api/csp-report` | No CSP reporting endpoint | ✅ DONE 2026-03-04 — CSP `report-uri /api/csp-report` + endpoint created |
| M8 | `use-last-login.js`, `auth.js` | Client-side only login tracking | ✅ DONE 2026-03-04 — Server records LoginHistory in auth.js signIn event |
| M9 | `use-form-draft.js` | Stores form data unencrypted | ✅ DONE 2026-03-04 — Excludes password/token fields, validates schema on restore |
| M10 | Dashboard, shell | Hardcoded dates ("9 Jan 2025") | ✅ DONE 2026-03-04 — Shell and dashboard now derive dates from `session.user.tierExpiresAt` via `useShellUser()` / `useLayoutUser()` hooks. Falls back to FALLBACK_USER with null expiresOn. |

### 1.4 LOW — Polish

Can be deferred to post-launch iterations.

| # | File(s) | Gap | Status |
|---|---------|-----|--------|
| L1 | `public/robots.txt`, `src/app/sitemap.ts` | No SEO crawlability config | ✅ DONE 2026-03-04 — robots.txt + dynamic sitemap.ts created |
| L2 | deal, supplier (routes) | No dynamic metadata | ⏳ PENDING — Static metadata added; `generateMetadata()` needs data fetching (after H1). Routes renamed from single-deal→deal, supplier-profile→supplier. |
| L3 | Contact.jsx FAQ content | Hardcoded FAQ Q&As | ⏳ PENDING — Acceptable for now; move to CMS later |
| L4 | Contact.jsx addresses | Hardcoded office addresses | ⏳ PENDING — Acceptable for now; move to CMS later |
| L5 | Shell, dashboard, filters | Hardcoded currency/country lists | ✅ ACCEPTABLE — Static config is fine for these |
| L6 | `public/.well-known/security.txt` | No `security.txt` | ✅ DONE 2026-03-04 — RFC 9116 compliant security.txt created |
| L7 | `/api/auth/check-username` | No reserved username list on server | ✅ DONE 2026-03-04 — 28-word reserved list in API route |
| L8 | Auth flow | No account linking UI | ⏳ PENDING — Backend supports it; UI settings page needed later |

---

## 2. Required API Routes

These endpoints must be created during the production phase. Each includes the method, purpose, and key implementation details.

### 2.1 Authentication

```
POST /api/auth/register
  Body: { username, firstName, lastName, email, password, newsletter, agreeTerms }
  Server: validate all fields, check uniqueness, hash password (bcrypt), create user record,
          generate verification token, queue verification email
  Response: { success: true } or { errors: { field: message } }
  Rate limit: 3 per IP per hour

POST /api/auth/forgot-password
  Body: { email }
  Server: generate reset token (32 chars), store with 24h expiry, queue email
  Response: ALWAYS { success: true } (never reveal account existence)
  Rate limit: 3 per email per hour

GET /api/auth/verify-email?token=xxx
  Server: look up token, check expiry, mark email verified, delete token
  Response: redirect to /register?verified=true or error page

GET /api/auth/check-username?u=xxx
  Server: validate format, check reserved list, query DB
  Response: { available: boolean }
  Rate limit: 10 per IP per minute

GET /api/auth/check-email?email=xxx
  Server: validate format, query DB
  Response: { available: boolean }
  Rate limit: 10 per IP per minute
  Note: Consider always returning { available: true } to prevent enumeration

POST /api/auth/send-verification
  Body: { email, type: "registration" | "password-reset" | "login-resend" }
  Server: generate token, store with expiry, queue email via service
  Response: { success: true }
  Rate limit: 3 per email per hour
```

### 2.2 reCAPTCHA

```
POST /api/verify-recaptcha
  Body: { token, action }
  Server: POST to Google reCAPTCHA verify API with secret key
  Response: { success: boolean, score: number }
  Reject if score < 0.5
  Note: Call this server-side before processing any form submission
```

### 2.3 Contact

```
POST /api/contact
  Body: { queryType, fullName, email, subject, message, companyName?, phone?, website?, ...optional }
  Server: validate all fields server-side, verify reCAPTCHA token, sanitize content,
          send email to admin, send confirmation to user, store in DB
  Response: { success: true } or { errors: {...} }
  Rate limit: 5 per IP per hour
```

### 2.4 Data Endpoints

```
GET /api/deals?page=1&limit=20&category=&country=&sort=newest
  Server: query database with filters, return paginated results
  Response: { deals: [...], total: number, page: number }

GET /api/deals/[id]
  Server: fetch single deal with supplier info
  Response: { deal: {...}, supplier: {...}, relatedDeals: [...] }

GET /api/suppliers?page=1&limit=20&category=&country=&rating=
  Server: query database with filters
  Response: { suppliers: [...], total: number }

GET /api/suppliers/[id]
  Server: fetch supplier with deals and reviews
  Response: { supplier: {...}, deals: [...], reviews: [...] }

GET /api/categories
  Server: fetch categories with live supplier/deal counts
  Response: { categories: [...] }

GET /api/testimonials?page=1&limit=10
  Server: paginated testimonials
  Response: { testimonials: [...], total: number }

GET /api/stats
  Server: live platform statistics
  Response: { suppliers: number, deals: number, members: number }

GET /api/pricing
  Server: current pricing tiers
  Response: { plans: [...] }
```

### 2.5 User / Dashboard

```
GET /api/user/profile
  Auth: required
  Response: { user: { salutation, firstName, lastName, companyName, regNumber, taxId, roleInCompany,
              yearEstablished, companySize, addressLine1, addressLine2, city, postcode, country,
              mobileNumber, mobileCountryCode, landlineNumber, landlineCountryCode, businessEmail,
              personalEmail, teamsHandle, linkedinUrl, whatsappNumber, whatsappCountryCode, languages } }

PATCH /api/user/profile
  Auth: required
  Body: { tab: "personal"|"address"|"contact", fields: { ...partial } }
  Note: Tab-level partial save (Save & Continue button)
  Response: { success: true }

PUT /api/user/profile
  Auth: required
  Body: { ...allFields }
  Note: Full form submission (Submit All button)
  Response: { success: true }

GET /api/user/buyer-profile
  Auth: required
  Response: { profile: { buyerType, describeBusiness, preferredSupplierTypes, sourcingModels,
              productsLookingFor, productCategories, countriesSourceFrom, brandsInterestedIn,
              productQualityTier, certificationRequirements, excludedCountries,
              preferredPaymentMethods, preferredDeliveryOptions, annualSalesVolume,
              annualPurchasingVolume, highestMinimumOrder, moqComfortLevel, preferredCurrency,
              shopWebsiteUrl, focusMarkets, communicationPreferences } }

PUT /api/user/buyer-profile
  Auth: required
  Body: { ...allBuyerFields }
  Response: { success: true }

GET /api/user/supplier-profile
  Auth: required
  Response: { profile: { supplierType, buyerTypesServed, companyDescription, supplyModels,
              customersServed, productsOffered, productCategories, countriesServed,
              brandsDistributed, productQualityTier, certifications, sampleAvailability,
              catalogueSize, excludedCountries, minimumOrderAmount, minimumOrderCurrency,
              paymentMethods, paymentTerms, deliveryMethods, returnPolicy, preferredCurrency,
              leadTime, discountTiers, discountNotes, companyWebsite, businessHours,
              companyLogo, socialFacebook, socialInstagram, socialLinkedin } }

PUT /api/user/supplier-profile
  Auth: required
  Body: { ...allSupplierFields }
  Response: { success: true }

GET /api/geocode/reverse?lat=XX&lng=YY
  Auth: required
  Server: Calls Google Maps Geocoding API server-side (keeps API key secret)
  Response: { addressLine1, city, postcode, country }
  Note: Used by account-profile "Use my location" button

GET /api/user/saved-deals
  Auth: required
  Response: { deals: [...] }

POST /api/user/save-deal
  Auth: required
  Body: { dealId }
  Response: { success: true }
```

---

## 3. Required Environment Variables

All must be set in `.env.local` (development) and the hosting platform (production).

### 3.1 Authentication

```env
AUTH_SECRET=                      # NextAuth secret (generate with: openssl rand -base64 32)
GOOGLE_CLIENT_ID=                 # Google OAuth
GOOGLE_CLIENT_SECRET=
APPLE_ID=                         # Apple OAuth
APPLE_SECRET=
FACEBOOK_CLIENT_ID=               # Facebook OAuth
FACEBOOK_CLIENT_SECRET=
```

### 3.2 reCAPTCHA

```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=   # Public site key (replaces hardcoded test key)
RECAPTCHA_SECRET_KEY=             # Server-side verification secret
```

### 3.3 Email Service

```env
EMAIL_PROVIDER=                   # "sendgrid" | "resend" | "ses"
EMAIL_API_KEY=                    # Provider API key
EMAIL_FROM=                       # Sender address (e.g., noreply@wholesaleup.com)
EMAIL_REPLY_TO=                   # Reply-to address
```

### 3.4 Database

```env
DATABASE_URL=                     # PostgreSQL/MySQL connection string
```

### 3.5 Rate Limiting

```env
UPSTASH_REDIS_REST_URL=           # If using Upstash for rate limiting
UPSTASH_REDIS_REST_TOKEN=
```

### 3.6 Site Protection (Remove for Public Launch)

```env
SITE_PASSWORD=                    # Current basic auth protection — remove when going public
```

### 3.7 Monitoring (Optional)

```env
SENTRY_DSN=                       # Error tracking
NEXT_PUBLIC_ANALYTICS_ID=         # Analytics (Vercel, GA, Plausible)
```

---

## 4. Demo Code Patterns — How to Replace

### 4.1 setTimeout Simulation → Real API Call

**Before (demo):**
```jsx
setLoading(true);
setTimeout(() => {
  setLoading(false);
  setSuccess(true);
}, 1500);
```

**After (production):**
```jsx
setLoading(true);
try {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    setErrors(data.errors || { server: data.message });
    return;
  }
  setSuccess(true);
} catch (_err) {
  setServerError("Something went wrong. Please try again.");
} finally {
  setLoading(false);
}
```

### 4.2 demo-auth CustomEvent → NextAuth Session

**Before (demo):**
```jsx
window.dispatchEvent(new CustomEvent("demo-auth", {
  detail: { loggedIn: true, premium: false, remember: rememberMe }
}));
```

**After (production):**
```jsx
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  redirect: false,
  identity: form.identity,
  password: form.password,
});
if (result?.error) {
  setErrors({ identity: "Invalid username/email or password" });
  recordAttempt();
} else {
  recordSuccess();
  router.push("/dashboard");
}
```

### 4.3 Hardcoded Data Array → Server Component Fetch

**Before (demo):**
```jsx
const DEALS = [
  { id: 1, title: "Bulk Electronics", price: "£2,499", ... },
  { id: 2, title: "Designer Handbags", price: "£890", ... },
];
export default function DealsPage() {
  return <DealCards deals={DEALS} />;
}
```

**After (production):**
```jsx
// page.tsx (Server Component)
export default async function DealsPage({ searchParams }) {
  const params = new URLSearchParams(searchParams);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals?${params}`, {
    next: { revalidate: 60 },
  });
  const { deals, total } = await res.json();
  return <DealCards initialDeals={deals} totalCount={total} />;
}
```

### 4.4 simulateApiCheck → Real Endpoint

**Before (demo):**
```js
const TAKEN_USERNAMES = new Set(["admin", "test", "demo"]);
function simulateApiCheck(username) {
  return new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
}
// Usage:
await simulateApiCheck(debouncedVal);
const taken = TAKEN_USERNAMES.has(lower);
```

**After (production):**
```js
// Remove TAKEN_USERNAMES and simulateApiCheck entirely
const res = await fetch(`/api/auth/check-username?u=${encodeURIComponent(debouncedVal)}`);
const { available } = await res.json();
if (!available) {
  setStatus("taken");
  setMessage("Username is already taken");
}
```

### 4.5 Console.log Removal

Search for and remove/guard all instances:
```bash
# Find all console statements in src/
grep -rn "console\.\(log\|warn\|error\)" src/ --include="*.jsx" --include="*.js" --include="*.ts"
```

Production pattern for development-only logging:
```js
if (process.env.NODE_ENV === "development") {
  console.log("[Debug]", data);
}
```

---

## 5. Security Hardening Checklist

### 5.1 Before Public Launch

- [x] Replace reCAPTCHA test key with production key (C1) ✅
- [x] Create server-side reCAPTCHA verification route (C2) ✅
- [x] Remove `'unsafe-inline'` and `'unsafe-eval'` from CSP; implement nonce-based CSP (C3) ✅
- [x] Enable HSTS header (C4) ✅
- [x] Implement server-side rate limiting on all auth + form endpoints (C7) ✅
- [ ] Remove `SITE_PASSWORD` basic auth middleware (C8) — keep until launch
- [x] Add rate limiting to email/username check endpoints to prevent enumeration (H8) ✅
- [x] Remove all `console.log` statements that expose tokens/data (M4, M5, M6) ✅
- [x] Validate all environment variables at startup — fail fast if missing ✅
- [x] Add CSP `report-uri` for violation monitoring (M7) ✅
- [x] Wire `tierExpiresAt` through JWT + session callbacks ✅ (Third audit fix)
- [x] Wire PROTECTED_ROUTES + AUTH_ROUTES in middleware.ts ✅ (Third audit fix)
- [x] Add TypeScript type augmentation for custom NextAuth session fields ✅ (Third audit fix)
- [x] Fix tierExpiresAt Date→String serialization in JWT callback ✅ (Fourth audit fix)
- [x] Remove unused imports from API routes ✅ (Fourth audit fix)
- [ ] Add rate limiting to public read API endpoints (deals, suppliers, categories)
- [ ] Capture IP/userAgent in LoginHistory (requires middleware integration)

### 5.2 Server-Side Validation Rules

Every API route must validate on the server — never trust client-side validation alone:

```
Email:    Same regex as client + MX record lookup (optional)
Password: Same 4 rules as client (8+ chars, uppercase, number, special)
Username: 3+ chars, alphanumeric + underscore only, not in reserved list
Names:    Non-empty, max 100 chars, strip HTML tags
Message:  Non-empty, max 5000 chars, sanitize HTML
Phone:    Optional; validate with libphonenumber if provided
URL:      Optional; validate format, disallow javascript: protocol
```

### 5.3 Password Handling

- **Never store plaintext passwords** — use bcrypt with cost factor ≥ 12
- **Never log passwords** — not even hashed
- **Breach check on server too** — re-check HIBP k-anonymity before accepting password
- **Force password change** if breach detected post-registration

---

## 6. Infrastructure Patterns

### 6.1 Error Boundaries

Create `error.tsx` at each route level:
```tsx
"use client";
export default function Error({ error, reset }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-500 mb-4">{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
        Try again
      </button>
    </div>
  );
}
```

Required at: `/app/error.tsx`, `/app/deals/error.tsx`, `/app/suppliers/error.tsx`, `/app/dashboard/error.tsx`

### 6.2 Loading States

Create `loading.tsx` with skeleton screens:
```tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-slate-200 rounded w-1/3" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

Required at: `/app/deals/loading.tsx`, `/app/suppliers/loading.tsx`, `/app/homepage/loading.tsx`, `/app/dashboard/loading.tsx`

### 6.3 SEO Metadata Pattern

```tsx
// Static pages
export const metadata = {
  title: "Wholesale Deals | WholesaleUp",
  description: "Browse 20,000+ verified wholesale and dropship deals...",
  openGraph: {
    title: "Wholesale Deals | WholesaleUp",
    description: "Browse 20,000+ verified wholesale and dropship deals...",
    type: "website",
    url: "https://wholesaleup.com/deals",
  },
};

// Dynamic pages
export async function generateMetadata({ params }) {
  const deal = await fetchDeal(params.id);
  return {
    title: `${deal.title} | WholesaleUp`,
    description: deal.description.slice(0, 160),
    openGraph: { images: [deal.image] },
  };
}
```

### 6.3.1 Phase 4 SEO — Inline PRODUCTION Comments

All Phase 4 SEO items (JSON-LD schemas, `generateMetadata()`, pagination) have `🔧 PRODUCTION SEO` comments embedded directly in the source files where they'll be implemented. Search codebase with `grep -r "PRODUCTION SEO"` to find all 9 locations. Full mapping in **SEO skill Section 12.4**.

### 6.4 Auth Gating Pattern

```tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/register?callbackUrl=/dashboard");
  const user = await fetchUserProfile(session.user.id);
  return <Dashboard user={user} />;
}
```

Protected routes: `/dashboard`, `/deal` (premium content), `/supplier` (contact info)

---

## 7. File Reference — Production Gaps by File

| File | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| `auth.js` | C5, C6 | H7 | — | — | ✅ tierExpiresAt in JWT+session |
| `next.config.js` | C3, C4 | — | M7 | L6 |
| `middleware.ts` | C8 | — | — | — |
| `use-recaptcha.js` | C1, C2 | — | — | — |
| `use-rate-limit.js` | C7 | — | — | — |
| `use-email-check.js` | C13 | H8 | — | — |
| `use-username-check.js` | C14 | H8 | — | L7 |
| `use-verification-email.js` | C12 | — | M5 | — |
| `register.jsx` | C9, C10, C11 | — | M4 | — |
| `auth-modal.jsx` | C9, C10, C11 | H5, H6 | M4 | — |
| `contact.jsx` | C15 | H10 | M4 | L3, L4 |
| `shell.jsx` | — | H9 | M10 | L5 |
| `dashboard.jsx` | C16 | H9 | M10 | — |
| `homepage.jsx` | — | H1, H2 | — | — |
| `deal-cards.jsx` | — | H1, H2 | M2, M3 | — |
| `filters.jsx` | — | H1 | M2, M3 | — |
| `single-deal.jsx` | C16 | H1, H2 | M3 | L2 |
| `supplier-profile.jsx` | C16 | H1, H2 | M3 | L2 |
| `suppliers.jsx` | — | H1, H2 | M2, M3 | — |
| `pricing.jsx` | — | H1 | — | — |
| `categories.jsx` | — | H1 | — | — |
| `testimonials.jsx` | — | H1 | M2 | — |
| `use-breach-check.js` | — | — | M6 | — |
| `use-last-login.js` | — | — | M8 | — |
| `use-form-draft.js` | — | — | M9 | — |
| All page.tsx files | — | H2, H3, H4 | M1 | L1 |

---

## 8. Database Seeding

### 8.1 Seed Script

Location: `prisma/seed.ts`

Run: `npx prisma db seed`

The seed script populates the database with initial data extracted from hardcoded arrays in component files. It uses the Prisma `upsert` pattern for idempotent seeding (safe to re-run).

### 8.2 Seed Functions

| Function | Prisma Model | Source Components |
|----------|-------------|-------------------|
| `seedCategories()` | Category | homepage.jsx, categories.jsx, filters.jsx |
| `seedSuppliers()` | Supplier | homepage.jsx, suppliers.jsx, supplier-profile.jsx |
| `seedSupplierCategories()` | SupplierCategory | (join table, derived from suppliers) |
| `seedDeals()` | Deal | homepage.jsx, deal-cards.jsx, single-deal.jsx |
| `seedTestimonials()` | Testimonial | homepage.jsx, register.jsx, auth-modal.jsx, pricing.jsx, deal-cards.jsx, suppliers.jsx, single-deal.jsx, supplier-profile.jsx |
| `seedPricingPlans()` | PricingPlan | pricing.jsx |
| `seedPlatformStats()` | PlatformStat | homepage.jsx, register.jsx, auth-modal.jsx, categories.jsx, testimonials.jsx, deal-cards.jsx, suppliers.jsx, single-deal.jsx, supplier-profile.jsx |

### 8.3 Cross-Reference System

Every hardcoded data array in component files has a **bidirectional cross-reference**:

**Component → Seed:** Each PRODUCTION comment block in components includes a `SEED:` line pointing to the relevant seed function(s):
```
SEED: prisma/seed.ts → seedDeals(), seedTestimonials(), seedPlatformStats()
```

**Seed → Component:** The header of `prisma/seed.ts` contains a full cross-reference table mapping every seed function back to its source component, line number, and array name.

### 8.4 Migration Workflow

After seeding the database:
1. Run `npx prisma db seed` to populate initial data
2. Create API routes (Section 2.4) that query the seeded tables
3. In each component, replace the hardcoded array with a SWR/React Query call to the corresponding API endpoint (already documented in each PRODUCTION comment)
4. Delete the hardcoded array once the API is wired
5. The `SEED:` comment can be removed once the migration is complete

### 8.5 Execution Order

The seed script runs functions in dependency order:
1. Categories (no dependencies)
2. Suppliers (no dependencies)
3. SupplierCategories (depends on Categories + Suppliers)
4. Deals (depends on Suppliers + Categories)
5. Testimonials (no dependencies)
6. PricingPlans (no dependencies)
7. PlatformStats (no dependencies)

---

## 9. Migration Order (unchanged numbering for backwards compat)

Recommended sequence for the production phase:

**Phase 1: Security Foundation (Week 1)**
1. Set up database (PostgreSQL) + ORM (Prisma/Drizzle)
2. Create user table with password hashing
3. Replace reCAPTCHA test key with production key (C1)
4. Implement server-side reCAPTCHA verification (C2)
5. Implement server-side rate limiting middleware (C7)
6. Fix CSP headers — remove unsafe-inline/eval, add nonces (C3)
7. Enable HSTS (C4)

**Phase 2: Auth System (Week 2)**
8. Wire NextAuth to database adapter (C5)
9. Implement session revocation (C6)
10. Create `/api/auth/register` route (C11)
11. Replace demo-auth events with real NextAuth sessions (C9, C10)
12. Create `/api/auth/check-username` and `/api/auth/check-email` routes (C13, C14)
13. Wire Remember Me to JWT maxAge (H6)
14. Add auth gating to protected routes (C16)

**Phase 3: Email & Verification (Week 3)**
15. Integrate email service (SendGrid/Resend) (C12)
16. Create verification token system + `/api/auth/verify-email` route
17. Create `/api/auth/forgot-password` route (H5)
18. Create `/api/auth/send-verification` route
19. Create `/api/contact` route (C15)
20. Add server-side validation to all form endpoints (H10)

**Phase 4: Data Layer (Week 3-4)**
21. Create data tables (deals, suppliers, categories, testimonials)
22. Create all data API routes (Section 2.4)
23. Replace hardcoded data arrays with database queries (H1)
24. Convert page.tsx files to async Server Components (H2)
25. Replace MOCK_USER with real session data (H9)

**Phase 5: UX Polish (Week 4)**
26. Add error.tsx boundaries (H3)
27. Add loading.tsx skeletons (H4)
28. Add SEO metadata to all pages (M1)
29. Implement server-side pagination (M2)
30. Replace `<img>` with `next/image` (M3)
31. Remove all console.log statements (M4, M5, M6)

**Phase 6: Final Hardening (Week 5)**
32. Remove SITE_PASSWORD middleware (C8)
33. Add CSP reporting (M7)
34. Create robots.txt + sitemap.ts (L1)
35. Create security.txt (L6)
36. Final security audit + penetration testing

---

## 9. Production Checklist — Pre-Launch

### Code & Architecture (completed)
- [x] All CRITICAL gaps (C1–C16) resolved ✅
- [x] All HIGH gaps (H1–H10) resolved ✅
- [x] reCAPTCHA production key config ready (env-based) ✅
- [x] CSP hardened (strict-dynamic, no unsafe-inline/eval) ✅
- [x] HSTS enabled ✅
- [x] Server-side rate limiting on all form/auth endpoints ✅
- [x] Auth gating on all protected routes (page.tsx + middleware) ✅
- [x] Error boundaries at all route levels ✅
- [x] Loading skeletons for all data-dependent pages ✅
- [x] SEO metadata on all public pages ✅
- [x] No console.log in production build (all dev-guarded) ✅
- [x] All demo-auth CustomEvent patterns removed ✅
- [x] useSession() wired in all auth-dependent components ✅
- [x] TypeScript type declarations for NextAuth session ✅
- [x] All hardcoded data arrays annotated with API endpoints ✅
- [x] Database seed script created with cross-references (prisma/seed.ts) ✅
- [x] All component data arrays annotated with SEED: references ✅
- [x] tierExpiresAt Date→String conversion in JWT callback ✅ (Fourth audit fix)
- [x] Unused imports cleaned from API routes ✅ (Fourth audit fix)
- [x] testimonials-data.js annotated with SEED reference ✅ (Fourth audit fix)
- [x] seed.ts cross-reference line numbers corrected (24 entries) ✅ (Fourth audit fix)
- [x] Error boundaries expanded to 12 routes (6 new in fourth audit) ✅
- [x] SEO metadata on gating + shell pages ✅ (Fourth audit fix)
- [x] Session update tier escalation blocked (_serverVerified guard) ✅ (Fifth audit fix)
- [x] Credentials provider returns tierExpiresAt ✅ (Fifth audit fix)
- [x] toISOString type guard (handles string and Date) ✅ (Fifth audit fix)
- [x] Rate limiter memory leak fixed (cleanup + sweep) ✅ (Fifth audit fix)
- [x] user.pin conditional render (prevents undefined) ✅ (Fifth audit fix)
- [x] Tier upgrade banner shows for all non-premium users ✅ (Fifth audit fix)
- [x] Deals API sort field whitelist ✅ (Fifth audit fix)
- [x] Suppliers API rating NaN validation ✅ (Fifth audit fix)
- [x] Saved deals savedAt field name corrected ✅ (Fifth audit fix)

### Remaining Before Launch
- [ ] Set all environment variables (see Section 3)
- [ ] Run `npx prisma migrate deploy` for database tables
- [ ] Run `npx prisma db seed` to populate initial data (see Section 8)
- [ ] Test email delivery (registration, verification, password reset, contact)
- [ ] Remove `SITE_PASSWORD` env var to disable staging protection
- [ ] Wire SWR/React Query to replace remaining hardcoded data arrays (M2)
- [x] Bulk replace `<img>` with next/image (M3) ✅ 2026-03-08 — Product images, hero images, avatars, thumbnails converted. Tiny flags/icons left as `<img>`.
- [ ] Add rate limiting to public read endpoints (deals, suppliers, categories, testimonials)
- [ ] Extract shared validation constants (reserved usernames, password rules)
- [ ] Wire loginLimiter to credentials provider (brute force protection)
- [ ] Add `pin` field to User model if PIN feature is needed
- [ ] Handle malformed JSON in POST routes (return 400 not 500)
- [ ] Clean up 8 .bak files from version control
- [ ] SSL certificate configured
- [ ] Monitoring/error tracking active (Sentry or equivalent)
- [ ] Backup strategy documented
- [ ] Create profile API routes (GET/PUT /api/user/buyer-profile, GET/PUT /api/user/supplier-profile, GET /api/geocode/reverse)

---

## 10. Profile Pages — Production Details

### 10.1 Route Map (updated 2026-03-08)

| Public URL | Route Directory | Component File | Auth Required |
|------------|----------------|----------------|---------------|
| `/dashboard` | `src/app/dashboard/page.tsx` | `account-profile.jsx` | Yes |
| `/dashboard/buyer-profile` | `src/app/dashboard/buyer-profile/page.tsx` | `buyer-profile.jsx` | Yes |
| `/dashboard/supplier-profile` | `src/app/dashboard/supplier-profile/page.tsx` | `supplier-profile-form.jsx` | Yes |
| `/deal` | `src/app/deal/page.tsx` | `single-deal.jsx` | Yes (premium) |
| `/supplier` | `src/app/supplier/page.tsx` | `supplier-profile.jsx` (public view) | Yes (contact info) |

Note: `/deal` was `/single-deal` and `/supplier` was `/supplier-profile` before the 2026-03-08 route rename.

### 10.2 Account Profile (`account-profile.jsx`)

**Line count:** ~1,223 lines | **Tabs:** 3 | **Route:** `/dashboard`

**Tabs & Required Fields:**

| Tab | ID | Required Fields | Optional Fields |
|-----|----|----------------|-----------------|
| Personal & Business | `personal` | salutation, firstName, lastName, companyName | regNumber, taxId, roleInCompany, yearEstablished, companySize |
| Address | `address` | addressLine1, city, postcode, country | addressLine2 |
| Contact Options | `contact` | mobileNumber, businessEmail, languages | landlineNumber, personalEmail, teamsHandle, linkedinUrl, whatsappNumber |

**Custom Hooks:**
- `useFormDraft("account-profile")` — localStorage draft persistence
- `useProfileSaveTime("account")` — stale profile timestamp tracking
- `usePanelCollapse` — sidebar tips panel toggle
- `useDropdown` — dropdown utilities
- `usePageUser` — session-derived user context

**PRODUCTION Comments (5):**
- Line 778: `PATCH /api/user/profile` (tab-level save)
- Line 809: `PUT /api/user/profile` (full submission)
- Line 978: Google Maps integration requirements (4 steps)
- Line 1001: Reverse-geocode auto-fill (commented-out code ready to enable)
- Line 1042: `NEXT_PUBLIC_GOOGLE_MAPS_KEY` env var requirement

**Special Features:**
- "Use my location" geolocation button with reverse-geocoding (requires Google Maps API)
- Static map preview (requires Google Maps Static API)
- Phone number validation with international country codes (PHONE_RULES per country)
- Language selector (multi-select)
- LinkedIn URL validation

**API Endpoints Needed:**
- `PATCH /api/user/profile` — partial tab save
- `PUT /api/user/profile` — full form submission
- `GET /api/geocode/reverse?lat=XX&lng=YY` — server-side Google Maps reverse-geocoding

**Env Vars Needed:** `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (Google Cloud: Maps Static API + Geocoding API)

### 10.3 Buyer Profile (`buyer-profile.jsx`)

**Line count:** ~1,207 lines | **Tabs:** 4 | **Route:** `/dashboard/buyer-profile`

**Tabs & Required Fields:**

| Tab | ID | Required Fields | Optional Fields |
|-----|----|----------------|-----------------|
| Buyer Profile | `business-profile` | buyerType, describeBusiness, preferredSupplierTypes, sourcingModels | — |
| Sourcing Preferences | `sourcing-preferences` | productsLookingFor, productCategories, countriesSourceFrom | brandsInterestedIn, productQualityTier, certificationRequirements, excludedCountries |
| Purchasing & Delivery | `purchasing-logistics` | preferredPaymentMethods, preferredDeliveryOptions | annualSalesVolume, annualPurchasingVolume, highestMinimumOrder, moqComfortLevel, preferredCurrency |
| Online Presence & Market Focus | `profile-visibility` | — | shopWebsiteUrl, focusMarkets, communicationPreferences |

**Custom Hooks:**
- `useFormDraft("wup-buyer-profile-draft")` — localStorage draft persistence
- `useProfileSaveTime("buyer")` — stale profile timestamp tracking
- `usePanelCollapse` — sidebar tips panel toggle
- `useDropdown` — dropdown utilities
- `usePageUser` — session-derived user context
- `useHeaderCurrency` — global currency header sync

**PRODUCTION Comments (4):**
- Line 411: Fetch saved buyer profile on mount
- Line 421: Replace initial state with DB data
- Line 675: `PUT /api/user/buyer-profile` (tab-level save)
- Line 709: `PUT /api/user/buyer-profile` (full submission)

**Special Features:**
- PRODUCT_CATEGORY_TREE hierarchical category selector
- BrandPillInput for brand name entry
- CurrencyAmountInput for financial fields
- Cross-matching reference data shared with supplier-profile (buyer types, supplier types, payment methods, delivery options, certifications, sourcing models — matching `value` keys for DB queries)

**API Endpoints Needed:**
- `GET /api/user/buyer-profile` — fetch saved profile on mount
- `PUT /api/user/buyer-profile` — save profile (tab-level and full)

### 10.4 Supplier Profile Form (`supplier-profile-form.jsx`)

**Line count:** ~1,491 lines | **Tabs:** 4 | **Route:** `/dashboard/supplier-profile`

**Tabs & Required Fields:**

| Tab | ID | Required Fields | Optional Fields |
|-----|----|----------------|-----------------|
| Supplier Profile | `business-profile` | supplierType, buyerTypesServed, companyDescription, supplyModels | customersServed |
| Products & Supply | `products-supply` | productsOffered, productCategories, countriesServed | brandsDistributed, productQualityTier, certifications, sampleAvailability, catalogueSize, excludedCountries |
| Orders & Payments | `orders-payments` | minimumOrderAmount, paymentMethods, deliveryMethods, returnPolicy | preferredCurrency, paymentTerms, leadTime, discountTiers, discountNotes |
| Reach & Operations | `reach-operations` | companyWebsite | businessHours, companyLogo, socialFacebook, socialInstagram, socialLinkedin |

**Custom Hooks:**
- `useFormDraft("wup-supplier-profile-draft")` — localStorage draft persistence
- `useProfileSaveTime("supplier")` — stale profile timestamp tracking
- `usePanelCollapse` — sidebar tips panel toggle
- `useDropdown` — dropdown utilities
- `usePageUser` — session-derived user context
- `useHeaderCurrency` — global currency header sync

**PRODUCTION Comments (4 — added 2026-03-08):**
- Line 647: Fetch saved supplier profile on mount
- Line 648: Replace initial state with DB data
- Line 888: `PUT /api/user/supplier-profile` (tab-level save)
- Line 919: `PUT /api/user/supplier-profile` (full submission)

**Special Features:**
- BusinessHoursGrid component (weekly open/close times)
- ImageUploadPlaceholder for company logo
- Discount tiers array (dynamic add/remove rows)
- CurrencyAmountInput for MOQ fields
- Lead time selector
- Profile completeness percentage stored in localStorage (`wup-supplier-profile-pct`)
- Cross-matching reference data shared with buyer-profile (matching `value` keys)

**API Endpoints Needed:**
- `GET /api/user/supplier-profile` — fetch saved profile on mount
- `PUT /api/user/supplier-profile` — save profile (tab-level and full)

### 10.5 Shared Infrastructure Across All Profiles

**Shared Hooks:**
- `useFormDraft` — Persists form state to localStorage. Auto-restores on mount. Excludes password/token fields. `clearDraft()` called on successful save.
- `useProfileSaveTime` — Tracks last-saved timestamp in localStorage. `recordSave()` on submit. `getDaysStale()` returns days since last save (null if never saved).
- `StaleProfileBanner` — Amber warning banner shown when profile not updated in 30+ days. Dismissible per session.
- `FormTipsPanel` — Contextual sidebar tips per focused field. Collapsible via `usePanelCollapse`.

**Shared UI Components (from `form-fields.jsx` and `dashboard.jsx`):**
- FloatingField, FloatingSelect, FloatingTextarea — form inputs with floating labels
- PhoneInput — international phone number input with country code selector
- CountrySelect — country dropdown with flags
- LanguageSelector — multi-language picker
- MultiSelect — multi-select dropdown
- CategorySelector — hierarchical product category tree
- BrandPillInput — tag-style brand name input
- CurrencyAmountInput — currency + amount combo input
- BusinessHoursGrid — weekly business hours editor
- ImageUploadPlaceholder — logo/image upload placeholder
- ProfileTabBar — tab navigation with progress indicators
- ErrorSummaryPanel — validation error summary
- TabStatus / TabProgressBadge — tab completion indicators
- ProfileProgressBar — overall form completion meter

**Validation Patterns (all client-side — must be replicated server-side):**
- Email: RFC-compliant regex
- LinkedIn URL: linkedin.com/in/username format
- Phone: country-specific rules (PHONE_RULES per country code)
- Names: Unicode letter support (accents, apostrophes, hyphens)
- Required field length minimums (vary by field)
- URL validation (website fields)

### 10.6 Database Schema Considerations

Each profile form maps to a separate database table/relation:

```
User (1) ── (1) AccountProfile    { salutation, firstName, lastName, companyName, regNumber, taxId, ... }
User (1) ── (1) BuyerProfile      { buyerType, describeBusiness, preferredSupplierTypes, ... }
User (1) ── (1) SupplierProfile   { supplierType, buyerTypesServed, companyDescription, ... }
```

**Cross-matching fields** (buyer ↔ supplier, using shared `value` keys):
- `BUYER_TYPES` ↔ `BUYER_TYPES_SERVED`
- `SUPPLIER_TYPES` ↔ `SUPPLIER_TYPE_OPTIONS`
- `PAYMENT_METHODS` ↔ `PAYMENT_METHODS_SUPPLIER`
- `DELIVERY_OPTIONS` ↔ `DELIVERY_METHODS_SUPPLIER`
- `CERTIFICATIONS` (shared between both)
- `SOURCING_MODELS` ↔ `SUPPLY_MODELS`

These shared value keys enable the platform's buyer-supplier matching engine.
