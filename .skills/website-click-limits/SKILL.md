---
name: website-click-limits
description: |
  **WholesaleUp Website Click Limits & /go Redirect System**: Reference this skill whenever working on outbound supplier website links, the /go redirect route, click tracking, monthly usage limits, or any feature that controls how users access supplier external URLs. Covers the 500/mo click limit for Premium, Premium+, and Supplier Pro tiers, the 30-day billing cycle reset logic, the /go redirect route, the slug-based privacy model, the WebsiteLink component, and the WebsiteClickLimitProvider context. MANDATORY TRIGGERS: /go, go.php, website click, click limit, outbound link, supplier website, website URL, 500/mo, click tracking, monthly limit, reset cycle, WebsiteLink, WebsiteClickLimit, external link, visit website, slug redirect, url privacy
---

# WholesaleUp Website Click Limits & /go Redirect System

This is the single source of truth for how outbound supplier website URL clicks are gated, tracked, and limited.

## Overview

Premium, Premium+, and Supplier Pro accounts can click up to **500 supplier website URLs per month**. All other tiers see blurred/scrambled website URLs and cannot click through.

All outbound website clicks are routed through the `/go` redirect route. The `/go` URL uses the **supplier's public slug** (not the raw website URL) so the actual destination is never exposed in:
- The browser address bar
- Referrer headers sent to the target site
- Shared links or browser history
- Server access logs visible to intermediaries

## Eligible Tiers

| Tier | Can Click | Monthly Limit |
|---|---|---|
| Guest | No | — |
| Free | No | — |
| Standard | No | — |
| Premium | Yes | 500 |
| Premium+ | Yes | 500 |
| Supplier | No | — |
| Supplier Pro | Yes | 500 |

## /go Redirect URL Format

### Website links (subject to 500/mo limit)

```
/go?slug=threadline-trading-ltd&type=website
/go?slug=threadline-trading-ltd&deal=sony-xperia-l1&type=website
```

- `slug` — supplier's public identifier (used to look up the real URL server-side)
- `deal` — optional, the deal slug for analytics (which deal page the click came from)
- `type=website` — marks this as a website click, subject to the 500/mo limit

**IMPORTANT:** The raw website URL (`url=`) must NEVER appear in the `/go` query string in production. The `/go` API route resolves the actual URL server-side by looking up `supplier.companyWebsite` from the database using the slug.

### Social links (NOT subject to 500/mo limit)

```
/go?slug=threadline-trading-ltd&type=social
```

Social media links (LinkedIn, Facebook, Instagram, etc.) use `type=social`. They are tracked for analytics but are NOT rate-limited.

**PRODUCTION NOTE:** Social links currently use `url=` in the query string (legacy). These should also migrate to `slug=` for consistency and privacy.

## Billing Cycle & Reset Rules

The 500-click counter follows a **30-day rolling cycle** tied to the user's subscription:

1. **Reset trigger:** The counter resets to 0 every 30 days from the user's **latest upgrade date** to Premium, Premium+, or Supplier Pro.
2. **Upgrade date:** The date when the user first activated (or most recently renewed/upgraded to) their current eligible tier.
3. **Mid-cycle upgrade:** If a user upgrades from Free → Premium mid-cycle, the 30-day cycle starts fresh from the upgrade date. The counter resets to 0.
4. **Tier change within eligible tiers:** If a Premium user upgrades to Premium+ (or Supplier Pro), the cycle does NOT reset — it continues from the original upgrade date. Only a gap in eligibility (downgrade then re-upgrade) triggers a fresh cycle.
5. **Downgrade:** If a user downgrades from an eligible tier (e.g. Premium → Free), the counter is frozen. If they re-upgrade within the same 30-day window, the counter resumes from where it was. If they re-upgrade after the window has passed, a fresh 30-day cycle starts.
6. **Expiration:** At the end of each 30-day window, the counter automatically resets to 0 and a new window begins, regardless of how many clicks were used.

### Example Timeline

```
Day 0:   User upgrades Free → Premium. Counter = 0. Window: Day 0 – Day 30.
Day 15:  User has clicked 312 URLs. Remaining: 188.
Day 30:  Counter resets to 0. New window: Day 30 – Day 60.
Day 45:  User upgrades Premium → Premium+. Counter NOT reset (still within eligible tiers).
         Window continues: Day 30 – Day 60.
Day 60:  Counter resets to 0. New window: Day 60 – Day 90.
```

### Database Schema (Production)

```sql
-- On the user/subscription table:
website_clicks_count    INT DEFAULT 0        -- current count in this cycle
website_clicks_reset_at TIMESTAMPTZ          -- next reset date (upgrade_date + 30 days)

-- On each click event (for analytics):
website_click_log (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id),
  supplier_id   INT REFERENCES suppliers(id),
  target_url    TEXT NOT NULL,              -- resolved server-side, never from query string
  deal_slug     TEXT,                       -- which deal page the click came from (if any)
  link_type     VARCHAR(20) DEFAULT 'website',  -- 'website' or 'social'
  clicked_at    TIMESTAMPTZ DEFAULT NOW()
)
```

### API Route (Production)

```
GET /go?slug=<supplier-slug>&type=website|social[&deal=<deal-slug>]

Success:  302 redirect to the resolved URL
Failure:  403 { error: "click_limit_reached", resetAt: ISO8601 }
          401 { error: "not_authenticated" }
          403 { error: "tier_not_eligible" }
          404 { error: "supplier_not_found" }
```

The `/go` route must:
1. Parse `slug` from the query string
2. Look up the supplier record and resolve `companyWebsite` (for `type=website`) or the relevant social URL
3. Validate the user is authenticated and on an eligible tier
4. For `type=website` only: check `website_clicks_count < 500` and handle the 30-day reset window
5. Increment `website_clicks_count` (website only)
6. Log the click event
7. Return a 302 redirect to the resolved URL

## Frontend Implementation

### Components

**`WebsiteLink`** (`src/components/shared/website-link.jsx`)
- Reusable component that wraps ALL outbound supplier website links
- Props: `slug` (supplier identifier), `url` (fallback for demo), `dealSlug`, `children`, `className`
- Uses `useWebsiteClickLimit()` hook to check remaining clicks
- When limit is reached, replaces link with "Limit reached (500/mo)" badge
- Shows remaining count when ≤ 20 clicks left
- Builds `/go?slug=...&type=website` URL (falls back to `/go?url=...` when slug is not available, for demo mode only)

**`WebsiteClickLimitProvider`** (`src/components/shared/use-website-click-limit.jsx`)
- React context provider wrapping the app (in `layout.tsx`)
- Exposes: `canClickWebsite`, `remainingClicks`, `limitReached`, `trackClick`
- Demo mode: tracks clicks in React state (resets on page reload)
- Production mode: will call `/api/go` and use server-side count

### Integration Points

Website links appear in:
1. **Supplier sidebar on deal pages** (`src/components/deal/supplier-sidebar.jsx`) — "Website" button
2. **Supplier cards** (`src/components/phases/suppliers.jsx`) — "Visit Website" in list, grid, and detail panel cards
3. **Compact supplier panel** (`src/components/phases/supplier-deals.jsx`) — "Visit Website" in /supplier-deals sidebar
4. **Supplier profile page** (future) — direct website link

All outbound website links MUST use the `WebsiteLink` component to ensure click tracking and limit enforcement. Never build `/go?url=...` links manually for website clicks.

### Non-website outbound links

Social media links (LinkedIn, etc.) are NOT subject to the 500/mo limit. They use `&type=social` in the `/go` route and are tracked separately for analytics but not rate-limited. These currently build the `/go` URL manually in `supplier-sidebar.jsx`.

## UX States

| State | What the user sees |
|---|---|
| Not eligible (Guest/Free/Standard/Supplier) | Blurred/scrambled website URL via `BlurredText` component |
| Eligible, clicks remaining | Normal clickable link via `WebsiteLink` |
| Eligible, ≤ 20 clicks left | Link + "(X left)" count badge in orange |
| Eligible, limit reached (0 remaining) | Lock icon + "Limit reached (500/mo)" — non-clickable |
| Eligible, new billing cycle | Counter auto-resets, links become clickable again |

## Security & Privacy Rules

1. **Never expose the raw URL in the `/go` query string** in production. Always use `slug=` to identify the supplier, and resolve the URL server-side.
2. **Rate-limit the `/go` endpoint** to prevent abuse (e.g., 10 requests/second per user).
3. **Validate the slug** belongs to a real, active supplier before redirecting.
4. **Log all clicks** for analytics, including the resolved URL, but store this in the database — not in the URL.
5. **Set `rel="noopener noreferrer"`** on all outbound links to prevent the target site from accessing the referrer.
6. **No open redirect**: The `/go` route must only redirect to URLs stored in the supplier's database record, never to arbitrary URLs from the query string.
