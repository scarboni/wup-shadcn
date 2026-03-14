# WholesaleUp — Page & Component Registry

> **Last updated:** 2026-03-07
> **Purpose:** Track every page's status, which components it uses, and what's production-ready vs demo.

## Status Legend

- **DEMO** — Uses hardcoded/mock data, not connected to API
- **PARTIAL** — Some API integration, some mock data remaining
- **PROD** — Fully connected to backend, production-ready
- **PLACEHOLDER** — Route exists but content is minimal/TBD

## Public Pages

| Route | Phase Component | Status | Notes |
|-------|----------------|--------|-------|
| `/` | page.tsx (redirect) | PROD | Redirects to /homepage |
| `/homepage` | homepage.jsx | DEMO | Hero, stats, CTA sections. Stats from /api/stats |
| `/deals` | deal-cards.jsx | DEMO | Deal listing with filters, pagination |
| `/single-deal` | single-deal.jsx | DEMO | Individual deal detail page |
| `/suppliers` | suppliers.jsx | DEMO | Supplier directory with filters |
| `/supplier-profile` | supplier-profile.jsx | DEMO | Individual supplier detail |
| `/categories` | categories.jsx | DEMO | Category tree browser |
| `/filters` | filters.jsx | DEMO | Filter UI demonstration |
| `/pricing` | pricing.jsx | DEMO | Tier comparison table |
| `/testimonials` | testimonials.jsx | DEMO | Customer testimonials grid |
| `/register` | register.jsx | PARTIAL | Auth modal with credentials + OAuth. API connected for registration |
| `/contact` | contact.jsx | PARTIAL | Contact form, /api/contact endpoint exists |
| `/gating` | gating.jsx | DEMO | Premium content gating demo |
| `/privacy` | privacy.jsx | PROD | Static legal page |
| `/terms` | terms.jsx | PROD | Static legal page |
| `/cookies` | cookies.jsx | PROD | Static legal page |
| `/shell` | shell.jsx | DEMO | Layout demo only — NOT production |

## Dashboard Pages (Authenticated)

| Route | Phase Component | Status | Active Sidebar ID | Notes |
|-------|----------------|--------|-------------------|-------|
| `/dashboard` | dashboard.jsx (default export) | PLACEHOLDER | dashboard | Summary page, content TBD |
| `/dashboard/account-profile` | dashboard.jsx (AccountProfilePage) | DEMO | account-profile | Tabbed form: Personal, Address, Contact. Has tips panel |
| `/dashboard/account-access` | account-access.jsx | DEMO | account-access | Security settings, password, 2FA. Has tips panel |
| `/dashboard/buyer-profile` | buyer-profile.jsx | DEMO | buyer-profile | Business profile, categories, trade refs. Has tips panel |
| `/dashboard/newsletters` | newsletters.jsx | PLACEHOLDER | newsletters | Newsletter subscription management TBD |

## Shared Components

| Component | File | Used By | Notes |
|-----------|------|---------|-------|
| AppLayout | app-layout.jsx | Root layout | Production shell — dark blue nav, header, footer |
| AuthModal | auth-modal.jsx | Register page, gating | Login/register modal |
| AuthProvider | auth-provider.jsx | Root layout | NextAuth SessionProvider wrapper |
| AuthUI | auth-ui.jsx | Auth modal | Login/register form UI |
| BackToTop | back-to-top.jsx | AppLayout | Scroll-to-top button |
| Breadcrumb | breadcrumb.jsx | All dashboard pages | Breadcrumb navigation |
| ContactModal | contact-modal.jsx | Multiple pages | Contact form modal |
| CTABanner | cta-banner.jsx | Homepage, deals | Call-to-action sections |
| DemoAuthContext | demo-auth-context.jsx | Dashboard pages | Mock auth for development |
| DotWorldMap | dot-world-map.jsx | Homepage | d3-geo world map visualization |
| StarRating | star-rating.jsx | Deals, suppliers | Star rating display |
| VerifiedBadge | verified-badge.jsx | Suppliers | Verification badge icon |

## Shared Hooks

| Hook | File | Purpose |
|------|------|---------|
| useBreachCheck | use-breach-check.js | HaveIBeenPwned password check |
| useEmailCheck | use-email-check.js | Email availability validation |
| useFormDraft | use-form-draft.js | Auto-save form drafts |
| useLastLogin | use-last-login.js | Last login info display |
| useRateLimit | use-rate-limit.js | Client-side rate limit UI |
| useRecaptcha | use-recaptcha.js | reCAPTCHA integration |
| useUsernameCheck | use-username-check.js | Username availability validation |
| useVerificationEmail | use-verification-email.js | Email verification flow |

## Dashboard Shared Exports (from dashboard.jsx)

These are exported from `dashboard.jsx` and imported by other dashboard pages:

| Export | Type | Purpose |
|--------|------|---------|
| AccountSidebar | Component | Left navigation sidebar (expanded/collapsed) |
| MobileDashboardNav | Component | "Go to:" dropdown for mobile (< md) |
| UpgradeBanner | Component | Tier upgrade CTA banner |
| ProfileTabBar | Component | Tab navigation within forms |
| FormSection | Component | Collapsible form section wrapper |
| TabStatus | Component | Tab completion status indicator |
| FormTipsPanel | Component | Contextual help tips (right column) |
| ErrorSummaryPanel | Component | Validation error summary |
| FloatingField | Component | Floating label input field |
| FloatingTextarea | Component | Floating label textarea |
| CountrySelect | Component | Country dropdown with flags |
| FlagImg | Component | Country flag image helper |
| useDropdown | Hook | Dropdown open/close/outside-click logic |
| usePageUser | Hook | Get current user (session or demo) |
| COUNTRIES | Constant | Country list with codes/flags |
| TIER_CONFIG | Constant | Tier visual configuration |
| TIER_CTA | Constant | Tier CTA messaging |

## Known Issues / Dead Code

- `shell.jsx` line ~1051: Duplicate AccountSidebar component — dead code, never used
- `shell.jsx` generally duplicates `app-layout.jsx` — only used for /shell demo route
