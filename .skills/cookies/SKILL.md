---
name: cookies
description: |
  **WholesaleUp Cookie & Storage Consent System**: Reference this skill whenever working on cookie consent, localStorage usage, consent-gated script loading, analytics integration, marketing pixels, personalisation features, GDPR/ICO compliance, or any feature that stores data on the user's device. Covers the full inventory of localStorage keys and their consent categories, the cookie consent banner component, Google Consent Mode v2 integration points, consent withdrawal handling, and the rules for adding new storage. MANDATORY TRIGGERS: cookie, cookies, localStorage, sessionStorage, consent, GDPR, ICO, ePrivacy, analytics, marketing, personalisation, tracking, GTM, Google Tag Manager, Google Analytics, Facebook Pixel, consent mode, cookie banner, cookie policy, cookie settings, storage key, wup-cookie, privacy, data protection, script loading, tag manager
---

# WholesaleUp Cookie & Storage Consent System

This is the single source of truth for all client-side data storage, cookie consent logic, and compliance rules. Reference this whenever adding new localStorage keys, integrating analytics/marketing scripts, building features that persist user data on-device, or modifying the consent banner.

## Legal Framework

WholesaleUp is UK-based and serves EU/EEA users. The following regulations apply:

- **UK GDPR** + **Data Protection Act 2018** — consent must be freely given, specific, informed, and unambiguous
- **Privacy and Electronic Communications Regulations (PECR)** — UK implementation of the ePrivacy Directive; requires consent for non-essential cookies/storage
- **ICO guidance** — Reject must be as easy as Accept; no pre-ticked boxes; no cookie walls
- **CNIL enforcement precedent** — Accept and Reject buttons must have equal visual weight
- **EDPB dark pattern guidelines** — no ambiguous X close button; no misleading withdrawal flows

**Key rule:** Only strictly necessary storage (essential for a service explicitly requested by the user) is exempt from prior consent. Everything else — analytics, marketing, personalisation — requires explicit opt-in before being set or read.

## Consent Categories

All client-side storage falls into one of four categories. The category determines whether consent is required and which toggle in the preferences panel controls it.

| Category | Consent Required | Toggle | Description |
|----------|-----------------|--------|-------------|
| **Essential** | No (exempt) | Always active | Required for the website to function. Cannot be disabled. |
| **Analytics** | Yes | Off by default | Anonymous usage data to understand how visitors interact with the site. |
| **Marketing** | Yes | Off by default | Advertising cookies, conversion tracking, retargeting across platforms. |
| **Personalisation** | Yes | Off by default | Remembering user preferences, UI state, and tailoring the experience. |

### What qualifies as Essential

A storage item is essential ONLY if it is required to provide a service explicitly requested by the user. Being "helpful" or "improving UX" is not sufficient. Examples:

- Authentication session tokens
- Shopping cart / enquiry list contents
- CSRF protection tokens
- Cookie consent state itself (meta-consent)
- Form draft auto-save (prevents data loss during an active user action)
- Security information (last login details)
- Profile staleness detection (prompts user to update outdated data)

### What does NOT qualify as Essential

- UI panel collapse states (personalisation)
- Currency preference (personalisation)
- Profile completion percentages (personalisation)
- Google Analytics (analytics)
- Facebook Pixel (marketing)
- Google Ads conversion tracking (marketing)
- Retargeting cookies (marketing)

## Current Storage Inventory

### Essential (no consent required)

| Storage Key | Mechanism | File | Purpose |
|---|---|---|---|
| `wup-cookie-consent` | localStorage | `cookie-consent.jsx` | Stores user's consent choices + timestamp. Meta-consent — essential for compliance. |
| `wup-draft-account-profile` | localStorage | `account-profile.jsx` via `use-form-draft.js` | Auto-saves account profile form to prevent data loss. |
| `wup-buyer-profile-draft` | localStorage | `buyer-profile.jsx` via `use-form-draft.js` | Auto-saves buyer profile form to prevent data loss. |
| `wup-supplier-profile-draft` | localStorage | `supplier-profile-form.jsx` via `use-form-draft.js` | Auto-saves supplier profile form to prevent data loss. |
| `wup-deal-draft-new` | localStorage | `deal-form.jsx` via `use-form-draft.js` | Auto-saves deal upload form to prevent data loss. |
| `wup_last_login` | localStorage | `use-last-login.js` | Records last login time, browser, OS for security awareness display. |
| `wup-buyer-profile-last-saved` | localStorage | `use-profile-save-time.js` | Tracks when buyer profile was last updated; triggers stale-profile warning after 30 days. |
| `wup-supplier-profile-last-saved` | localStorage | `use-profile-save-time.js` | Tracks when supplier profile was last updated; triggers stale-profile warning after 30 days. |
| `next-auth.session-token` | HTTP-only cookie | NextAuth v5 (automatic) | JWT authentication token. 30-day default, 90-day with "Remember Me". |

**Form draft security:** The `use-form-draft.js` hook excludes sensitive fields by default: `password`, `confirmPassword`, `currentPassword`, `token`, `recaptchaToken`. Drafts are cleared on successful form submission.

### Personalisation (requires consent)

| Storage Key | Mechanism | File | Purpose |
|---|---|---|---|
| `wup-sidebar-collapsed` | localStorage | `use-panel-collapse.js` | Remembers left sidebar collapse state. |
| `wup-account-collapsed` | localStorage | `use-panel-collapse.js` | Remembers account sidebar collapse state. |
| `wup-tips-collapsed` | localStorage | `use-panel-collapse.js` | Remembers contextual tips panel collapse state. |
| `wup-filter-collapsed` | localStorage | `use-panel-collapse.js` | Remembers filter panel collapse state. |
| `wup-header-currency` | localStorage | `app-layout.jsx` | Remembers user's selected currency preference. |
| `wup-account-profile-pct` | localStorage | `account-profile.jsx` | Profile completion percentage for sidebar progress display. |
| `wup-buyer-profile-pct` | localStorage | `buyer-profile.jsx` | Profile completion percentage for sidebar progress display. |
| `wup-supplier-profile-pct` | localStorage | `supplier-profile-form.jsx` | Profile completion percentage for sidebar progress display. |
| `wup-deal-form-pct` | localStorage | `deal-form.jsx` | Deal form completion percentage for sidebar progress display. |

**Hydration note:** Panel collapse states use an inline `<script>` in `layout.tsx` to read localStorage before React hydration, setting `data-*` attributes on `<html>` to prevent visual flash. This script runs before consent check — if personalisation consent is later withdrawn, the keys should be cleared and the script should gracefully handle missing values (it already does via try/catch).

### Analytics (requires consent) — NOT YET IMPLEMENTED

| Future Item | Mechanism | Purpose |
|---|---|---|
| Google Analytics 4 (`_ga`, `_ga_*`) | First-party cookie (set by gtag.js) | Anonymous traffic analysis, user flow, page views. |
| Google Analytics session (`_gid`) | First-party cookie | Session-level visitor identification. |

### Marketing (requires consent) — NOT YET IMPLEMENTED

| Future Item | Mechanism | Purpose |
|---|---|---|
| Google Ads conversion (`_gcl_au`, `_gcl_aw`) | First-party cookie (set by GTM) | Conversion attribution for Google Ads campaigns. |
| Facebook Pixel (`_fbp`, `_fbc`) | First-party cookie (set by fbevents.js) | Conversion tracking and retargeting for Meta Ads. |
| Google Tag Manager | Script loader | Conditionally loads analytics and marketing tags based on consent state. |

## Cookie Consent Component

**File:** `src/components/shared/cookie-consent.jsx`

### Architecture

- Bottom-anchored dark banner (`bg-slate-900`) with semi-transparent backdrop overlay (`bg-black/40`)
- Three equal-weight buttons: Reject All, Preferences, Accept All (GDPR/CNIL compliant)
- Expandable preferences panel with per-category toggles, all OFF by default
- Essential category shows "Always active" (no toggle)
- localStorage key: `wup-cookie-consent` stores `{ analytics, marketing, personalization, timestamp }`
- Custom event `open-cookie-preferences` allows re-opening from footer

### Footer Links

The footer bottom bar contains two separate links:

- **Cookie Policy** — `<a href="/cookies">` — links to the legal cookie policy page
- **Cookie Settings** — `<button onClick={openCookiePreferences}>` — re-opens the consent preferences panel

### Integration Points

- Rendered in `app-layout.jsx` as `<CookieConsent />` after the exit-intent popup
- Excluded from `/maintenance` page (AppLayout bypass)
- Footer imports `openCookiePreferences` from `cookie-consent.jsx`

### Consent State Shape

```json
{
  "analytics": false,
  "marketing": false,
  "personalization": false,
  "timestamp": "2026-03-13T10:00:00.000Z"
}
```

## Rules for Adding New Storage

When building a new feature that stores data on the user's device, follow this checklist:

### 1. Classify the storage item

Ask: "Is this required for a service the user explicitly requested?" If yes → Essential. If no → classify as Analytics, Marketing, or Personalisation.

### 2. Choose the right consent gate

- **Essential:** Can read/write immediately. No consent check needed.
- **Personalisation:** Must check `consent.personalization === true` before reading or writing. If consent not given, use sensible defaults (e.g., sidebar expanded, default currency).
- **Analytics:** Must check `consent.analytics === true` before loading any analytics script or setting any analytics storage.
- **Marketing:** Must check `consent.marketing === true` before loading any ad/tracking script or setting any marketing storage.

### 3. Handle consent withdrawal

When a user changes their consent from granted to denied:
- Stop writing new values for that category
- Clear existing localStorage keys belonging to that category
- For cookies: set `max-age=0` to expire them immediately
- For third-party scripts (GTM, GA, Pixel): unload or stop firing events
- Essential items are never affected by withdrawal

### 4. Update this skill file

Add the new storage key to the appropriate table in the "Current Storage Inventory" section above. Include: key name, mechanism, file location, and purpose.

### 5. Update the cookie policy page

If the new storage item is user-facing or involves third-party data sharing, update the cookie policy at `/cookies` (`src/components/phases/cookies.jsx`).

## Google Consent Mode v2 — Implementation Guide

When integrating Google Analytics / Google Ads, implement Consent Mode v2 (mandatory since March 2024 for EEA/UK):

### Required Parameters

| Parameter | Maps to Category | Default Value |
|---|---|---|
| `analytics_storage` | Analytics | `denied` |
| `ad_storage` | Marketing | `denied` |
| `ad_user_data` | Marketing | `denied` |
| `ad_personalization` | Marketing | `denied` |

### Implementation Pattern

```javascript
// In <head> BEFORE loading GTM — set defaults to denied
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500,
});

// After user grants consent — update state
function updateGoogleConsent(consentState) {
  gtag("consent", "update", {
    analytics_storage: consentState.analytics ? "granted" : "denied",
    ad_storage: consentState.marketing ? "granted" : "denied",
    ad_user_data: consentState.marketing ? "granted" : "denied",
    ad_personalization: consentState.marketing ? "granted" : "denied",
  });
}
```

### Advanced vs Basic Mode

Use **Advanced mode** (recommended for e-commerce): load GTM with defaults set to `denied`, then update on consent. Google still models conversions from cookieless pings even when users deny consent, preserving campaign ROI measurement.

## Consent Expiry & Re-prompting

- Consent choices should be re-prompted every **12 months** (ICO best practice)
- Check `timestamp` in stored consent; if older than 12 months, show banner again
- On re-prompt, pre-fill toggles with the user's previous choices
- The consent timestamp is stored in the `wup-cookie-consent` localStorage entry

## Cookie Lifetime Guidelines

| Type | Recommended Max | Rationale |
|------|----------------|-----------|
| Session authentication | 30 days (90 with Remember Me) | Already implemented via NextAuth JWT maxAge |
| Form drafts | No expiry (cleared on submit) | Essential — prevents data loss |
| UI preferences | No expiry | Low-risk personalisation data |
| Analytics cookies | 2 years (Google default) | Industry standard for cohort analysis |
| Marketing/retargeting | 90 days | Sufficient for campaign attribution |
| Consent record | 12 months | Re-prompt after expiry |

## Compliance Checklist

Use this when auditing the site or before launch:

- [ ] All non-essential toggles default to OFF
- [ ] Accept and Reject buttons have equal visual weight
- [ ] No cookies/storage set before consent is given (except essential)
- [ ] Consent banner appears on first visit (no prior consent stored)
- [ ] Footer has both "Cookie Policy" (legal page) and "Cookie Settings" (preferences trigger)
- [ ] Users can withdraw consent as easily as they gave it
- [ ] No cookie wall — full site access without non-essential cookies
- [ ] Cookie policy page lists all cookies with names, purposes, and lifetimes
- [ ] Google Consent Mode v2 parameters set to `denied` by default
- [ ] Third-party scripts (GA, GTM, Pixel) only load after consent granted
- [ ] Personalisation localStorage keys cleared on consent withdrawal
- [ ] Consent re-prompted after 12 months
- [ ] Banner is responsive and usable on mobile
- [ ] Keyboard accessible (Tab, Enter, Escape) with proper ARIA attributes
- [ ] No pre-ticked boxes anywhere

## Production Migration Notes

The current implementation uses localStorage for consent persistence. For production:

1. **Replace with first-party cookie** — `wup-consent` cookie with `SameSite=Strict`, `Secure`, `HttpOnly=false` (needs JS access), 12-month expiry
2. **Server-side consent signal** — middleware reads consent cookie and conditionally injects GTM/analytics `<script>` tags in the response
3. **Consent audit log** — record consent events (granted/denied/withdrawn) to database with timestamp, user ID (if authenticated), and IP hash for compliance evidence
4. **Personalisation gating** — modify `use-panel-collapse.js` and currency preference to check personalisation consent before reading/writing localStorage; fall back to defaults if denied
