---
name: open-graph
description: "**WholesaleUp Open Graph & Social Meta Strategy**: Reference this skill whenever working on OG tags, social sharing previews, Twitter cards, meta descriptions, page titles, OG images, or any metadata that affects how WholesaleUp pages appear when shared on social media, messaging apps, or search results. Tracks what is determined vs pending per page type. MANDATORY TRIGGERS: Open Graph, og:title, og:image, og:description, Twitter card, social sharing, meta tags, social preview, link preview, share card, metadata, generateMetadata, page title, meta description"
---

# WholesaleUp Open Graph & Social Meta Strategy

Tracks Open Graph tags, Twitter cards, and social sharing metadata across all page types. Separates what has been determined and implemented from what is still pending decision or production work.

Last updated: 2026-03-13

---

## 1. Current Architecture

### Root Layout (layout.tsx) — Site-Wide Defaults

Every page inherits these unless explicitly overridden:

| Field | Value | Status |
|-------|-------|--------|
| `og:type` | `website` | DETERMINED |
| `og:site_name` | `WholesaleUp` | DETERMINED |
| `og:locale` | `en_GB` | DETERMINED |
| `og:image` | `/og-default.png` (1200×630) | DETERMINED — exists in /public |
| `og:image:alt` | `WholesaleUp — Verified Wholesale & Dropship Deals` | DETERMINED |
| `twitter:card` | `summary_large_image` | DETERMINED |
| `robots` | `index: true, follow: true, max-image-preview: large, max-snippet: -1` | DETERMINED |
| Title template | `%s | WholesaleUp` (default: `WholesaleUp — Verified Wholesale & Dropship Deals`) | DETERMINED |
| Description | Long-form value proposition (155+ chars) | DETERMINED |
| `metadataBase` | `https://wholesaleup.com` (from `NEXT_PUBLIC_APP_URL`) | DETERMINED |

### Structured Data (layout.tsx) — Site-Wide JSON-LD

| Schema | Status | Notes |
|--------|--------|-------|
| Organization | DETERMINED | Name, logo, description, social profiles, contact email |
| WebSite + SearchAction | DETERMINED | Search URL template: `/deals?q={search_term_string}` |

---

## 2. OG Visibility Gating — CRITICAL

OG tags are rendered server-side with no auth context. Crawlers and social platform scrapers are always anonymous. Therefore, **OG metadata must only include data visible to Guest-level (unauthenticated) users.**

### What is SAFE to include in OG tags

| Data | Reason |
|------|--------|
| Deal title | Public — visible to all visitors |
| Product images | Public — shown in image gallery to all |
| Wholesale price, RRP, margin % | Public — shown in pricing panel to all |
| MOQ, grade, category | Public — shown to all |
| Product description, specifications | Public — shown in tabs to all |
| Deal location / ships from (country) | Public — shown to all |
| Generic supplier type (e.g. "Verified Supplier") | Public — verified badge is visible to all |

### What must NEVER appear in OG tags

| Data | Reason | Gating Rule |
|------|--------|-------------|
| Supplier company name | Gated by `canViewName` (requires login + tier) | Show "Verified Supplier" instead |
| Supplier logo | Gated by `canViewBranding` (requires login + Supplier Pro or canViewSupplier) | Use generic/branded template instead |
| Supplier contact (email, phone, address) | Gated by `canViewSupplier` (Premium/Premium+ only) | Never include |
| Supplier business hours | Gated by `canViewSupplier` | Never include |
| Supplier payment terms, deposit % | Visible on page but commercially sensitive in social previews | Omit from OG |
| Buyer reviews (full text) | Gated for free users (blur overlay) | Aggregate score only (e.g. "4.6★") is acceptable |

### OG Image Implications

Dynamic OG images (Option B branded templates) must follow the same rules:

**Deal OG image template — SAFE layout:**
- Product image (from deal.images — public)
- Deal title
- Price + margin badge
- "Verified Supplier on WholesaleUp" (NOT the supplier name)
- WholesaleUp branding
- Grade badge if not "New"

**Supplier OG image template — SAFE layout:**
- Generic supplier icon or silhouette (NOT the actual logo unless Supplier Pro and publicly visible)
- "Verified Supplier on WholesaleUp" or supplier type label
- Aggregate stats only if public (e.g. deal count, member since year)
- WholesaleUp branding

**Decision — DETERMINED:** OG tags and OG images treat all data as Guest-level. Supplier identity (name, logo, contact) is never exposed in metadata. This is both a business rule (gating drives conversions to register/upgrade) and a data protection measure.

---

## 3. Page-by-Page OG Status

### Tier 1: High-Value Public Pages (SEO-Critical)

#### Homepage (`/homepage`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `WholesaleUp — Verified Wholesale & Dropship Deals` | DETERMINED |
| Description | `Join 900,000+ resellers sourcing verified wholesale and dropship deals from 42,900+ suppliers. Zero commissions.` | DETERMINED |
| OG title | Same as title | DETERMINED |
| OG description | Slightly shortened version | DETERMINED |
| OG image | Inherits `/og-default.png` | DETERMINED — but PENDING custom homepage OG image |
| Canonical | `/homepage` | DETERMINED — PENDING: should canonical be `/` instead? |
| JSON-LD | None page-specific | PENDING: consider adding FAQPage schema for the homepage FAQ section |

#### Deals Listing (`/deals`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Wholesale Deals` | DETERMINED |
| Description | `Browse 20,000+ verified wholesale and dropship deals. Filter by category, country, and price.` | DETERMINED |
| OG title/desc | Matches page title/desc | DETERMINED |
| OG image | Inherits `/og-default.png` | DETERMINED — but PENDING custom deals OG image |
| Canonical | `/deals` | DETERMINED |
| JSON-LD | None | PENDING: ItemList schema for featured/top deals |

**PENDING — Production:** When moved to `/deals/[category]` dynamic routes, each category page needs unique OG title/description/image. E.g. `/deals/electronics` → `Wholesale Electronics Deals | WholesaleUp` with an electronics-themed OG image.

#### Single Deal Page (`/deal`, `/deal2`, `/deal-variables`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Deal Details` / `Deal Details V2` / `Deal Variables` | DETERMINED (static placeholder) |
| Description | Generic deal description | DETERMINED (static placeholder) |
| OG title/desc | Generic | DETERMINED (static placeholder) |
| Canonical | `/deal`, `/deal2`, `/deal-variables` | DETERMINED |

**PENDING — Production (Critical):** When moved to `/deals/[slug]`, needs `generateMetadata()`:

```jsx
// Target implementation — already stubbed in deal/page.tsx as comments
// ⚠️ OG VISIBILITY: Guest-level data only — no supplier name/logo/contact
export async function generateMetadata({ params }) {
  const deal = await getDeal(params.slug);
  return {
    title: `${deal.title} — Wholesale Deal`,
    description: `Buy ${deal.title} wholesale at ${deal.currency}${deal.price} per unit. MOQ ${deal.moq}. ${deal.markup}% margin vs RRP ${deal.rrpCurrency}${deal.rrp}. Verified supplier on WholesaleUp.`,
    alternates: { canonical: `/deals/${params.slug}` },
    openGraph: {
      title: deal.title,
      description: `${deal.currency}${deal.price}/unit | ${deal.markup}% margin | MOQ ${deal.moq} | Verified supplier`,
      images: [{ url: deal.images[0], width: 800, height: 800, alt: deal.title }],
      type: "og:product",
    },
    twitter: {
      card: "summary_large_image",
      title: deal.title,
      description: `${deal.currency}${deal.price}/unit — ${deal.markup}% margin vs RRP`,
      images: [deal.images[0]],
    },
  };
}
```

**Decisions:**
- OG description includes price, margin, and MOQ — DETERMINED. `generateMetadata()` runs server-side so prices update dynamically. Social platform caches refresh within 24–48h (acceptable for wholesale pricing cadence). Facebook cache can be force-purged via their scrape API if needed.
- Should OG image be the first product image or a branded template with product + price overlay? — PENDING
- Should we generate dynamic OG images via Next.js `ImageResponse` API (Vercel OG)? — PENDING
- Product JSON-LD schema: needs price, availability, brand, rating, offers — already designed in SEO skill — PENDING implementation

#### Suppliers Listing (`/suppliers`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Verified Suppliers` | DETERMINED |
| Description | `Browse 42,900+ verified wholesale suppliers, liquidators, and dropshippers across the EU, UK, and North America.` | DETERMINED |
| OG title/desc | Matches | DETERMINED |
| Canonical | `/suppliers` | DETERMINED |

**PENDING:** When paginated, `rel="next"` / `rel="prev"` links. ItemList schema for top suppliers.

#### Single Supplier Profile (`/supplier`, `/supplier-profile`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Supplier Profile` | DETERMINED (static placeholder) |
| OG | Generic | DETERMINED (static placeholder) |

**PENDING — Production (Critical):** When moved to `/suppliers/[slug]`, needs `generateMetadata()`:

```jsx
// ⚠️ OG VISIBILITY: Supplier identity is gated — OG must use generic labels
// Only Supplier Pro profiles with public visibility can show name in OG
export async function generateMetadata({ params }) {
  const supplier = await getSupplier(params.slug);
  const isPublicProfile = supplier.isSupplierPro && supplier.publicProfileEnabled;
  const displayName = isPublicProfile ? supplier.companyName : "Verified Wholesale Supplier";
  return {
    title: `${displayName} | WholesaleUp`,
    description: isPublicProfile
      ? `${supplier.companyName} — verified ${supplier.supplierType} on WholesaleUp. ${supplier.activeDealCount} active deals.`
      : `Verified ${supplier.supplierType} supplier on WholesaleUp. Browse their wholesale deals. Register to see full details.`,
    alternates: { canonical: `/suppliers/${params.slug}` },
    openGraph: {
      title: displayName,
      // Only show logo for publicly visible Supplier Pro profiles
      images: isPublicProfile && supplier.companyLogo
        ? [{ url: supplier.companyLogo, width: 400, height: 400, alt: displayName }]
        : undefined,
      type: "profile",
    },
  };
}
```

**Decisions:**
- Supplier logo in OG image: only for Supplier Pro with public profile enabled — DETERMINED (see §2 Visibility Gating)
- Supplier name in OG: only for Supplier Pro with public profile; all others show "Verified Wholesale Supplier" — DETERMINED
- Supplier rating in OG description: no — rating is secondary and could be misleading without context — DETERMINED
- Organization JSON-LD per supplier: PENDING — only for Supplier Pro with public profile + physical address. Would use LocalBusiness type.

### Tier 2: Conversion Pages

#### Pricing (`/pricing`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Pricing Plans` | DETERMINED |
| Description | Plans & pricing description | DETERMINED |
| OG | Matches | DETERMINED |
| Canonical | `/pricing` | DETERMINED |
| JSON-LD | None | PENDING: consider Product schema for subscription plans, or FAQPage for pricing FAQ |

#### Register (`/register`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Sign Up / Log In` | DETERMINED |
| OG | Matches | DETERMINED |
| Canonical | `/register` | DETERMINED |

#### Categories (`/categories`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Product Categories` | DETERMINED |
| OG | Matches | DETERMINED |
| Canonical | `/categories` | DETERMINED |
| JSON-LD | None | PENDING: ItemList schema for categories |

### Tier 3: Trust & Legal Pages

#### Testimonials (`/testimonials`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Customer Reviews` | DETERMINED |
| OG | Matches | DETERMINED |
| Canonical | `/testimonials` | DETERMINED |
| JSON-LD | None | PENDING: Review schema or AggregateRating |

#### Contact (`/contact`)
| Field | Value | Status |
|-------|-------|--------|
| Title | `Contact Us` | DETERMINED |
| OG | Matches | DETERMINED |
| Canonical | `/contact` | DETERMINED |
| JSON-LD | None | PENDING: ContactPage schema |

#### Legal Pages (`/privacy`, `/terms`, `/cookies`)
| Field | Value | Status |
|-------|-------|--------|
| Title | Set per page | DETERMINED |
| OG | None (inherits layout defaults) | DETERMINED — low priority, fine as-is |
| Canonical | Set per page | DETERMINED |

### Tier 4: Internal/Demo Pages (noindex)

| Route | Status | Notes |
|-------|--------|-------|
| `/shell` | robots: noindex, nofollow | Dev-only. No OG needed. |
| `/gating` | robots: noindex, nofollow | Dev-only. No OG needed. |
| `/filters` | No explicit robots | PENDING: should be noindex or merged into /deals |
| `/single-deal` | No explicit robots | PENDING: should be noindex (superseded by /deal-variables) |

### Tier 5: Dashboard (Protected, noindex)

All `/dashboard/*` routes have `robots: { index: false, follow: false }`. No OG needed — these are authenticated pages that should never appear in search or social sharing.

---

## 4. OG Image Strategy

### Current State
One generic image: `/og-default.png` (1200×630) used site-wide.

### PENDING Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| **Per-page static OG images** | Create unique images for homepage, deals, suppliers, pricing, categories | Yes — at minimum homepage and deals listing need distinct images |
| **Dynamic deal OG images** | (a) Use first product photo, (b) Generate branded template via Next.js ImageResponse, (c) Pre-render at listing time | Option (b) recommended — branded template with product image + price + margin badge gives best CTR |
| **Dynamic supplier OG images** | (a) Use company logo, (b) Branded template with logo + rating + deal count | Option (b) for suppliers with logos, fallback to generic for those without |
| **Image CDN / caching** | Where to host generated OG images | PENDING — depends on infrastructure (Vercel, Cloudflare, self-hosted) |

### Dynamic OG Image Template Design (PENDING)

For deal pages, the ideal OG image (1200×630) should contain:
- Product image (left 40%)
- Product title (right, large text)
- Price + margin badge (`€229 / unit · 74% margin`)
- Supplier name + verified badge
- WholesaleUp logo (bottom-right corner)
- Grade badge if not "New"

For supplier pages:
- Company logo (centered or left)
- Company name + verified badge
- Key stats: `42 active deals · 4.8★ · Member since 2019`
- WholesaleUp branding

---

## 5. Structured Data Roadmap (JSON-LD)

### Implemented
- Organization (site-wide)
- WebSite + SearchAction (site-wide)

### PENDING — High Priority
| Schema | Page | Data Source | Notes |
|--------|------|-------------|-------|
| Product + Offer | `/deals/[slug]` | Deal object | Price, currency, availability, brand, MOQ, images, rating |
| BreadcrumbList | All public pages | `categoryBreadcrumb` array | Already have breadcrumb data in deal objects |
| AggregateRating | `/deals/[slug]` | `productReputation.overallScore` | Enables star snippets in Google results |

### PENDING — Medium Priority
| Schema | Page | Notes |
|--------|------|-------|
| ItemList | `/deals`, `/suppliers`, `/categories` | Top deals/suppliers lists for rich results |
| LocalBusiness | `/suppliers/[slug]` | For suppliers with physical addresses |
| FAQPage | `/pricing`, `/homepage` | For FAQ sections already in the UI |
| Review | `/testimonials` | Individual review entries |

### PENDING — Low Priority
| Schema | Page | Notes |
|--------|------|-------|
| HowTo | Help/guide pages (future) | Onboarding flows |
| Event | Promotional landing pages (future) | Flash sales, seasonal events |

---

## 6. URL Structure Migration (PENDING)

Current demo routes need migrating to production-ready slugified URLs:

| Current | Production | Status |
|---------|-----------|--------|
| `/deal?id=X` or `/deal-variables` | `/deals/[slug]` | PENDING |
| `/supplier?id=X` or `/supplier-profile` | `/suppliers/[slug]` | PENDING |
| `/homepage` | `/` | PENDING — canonical should be root |
| `/deals` | `/deals` (listing) + `/deals/[category]` (filtered) | PENDING |

Each migration requires updating canonical URLs, OG URLs, and internal links.

---

## 7. Twitter-Specific Considerations

### Current
Only `card: "summary_large_image"` set at layout level. No Twitter-specific titles, descriptions, or images on any page.

### PENDING Decisions
| Decision | Notes | Status |
|----------|-------|--------|
| X handle (`twitter:site`) | `@wholesaleup` — set via `X_HANDLE` constant in `layout.tsx`. Replace with real handle when account is created. | DETERMINED |
| X creator (`twitter:creator`) | Same `X_HANDLE` constant. Per-supplier attribution not needed — all content is platform-published. | DETERMINED |
| X-specific descriptions | Not needed — X/Twitter falls back to OG tags automatically. | DETERMINED |

---

## 8. Locale, Currency & Country Domains

### Current
`og:locale` is set to `en_GB` in root layout. The site offers a currency selector in the header (EUR, GBP, USD, etc.) that converts prices client-side. Country-specific domains are planned (e.g. `wholesaleup.co.uk`, `wholesaleup.de`, `wholesaleup.com`).

### Currency in OG Tags — DETERMINED (Hybrid Strategy)

Country domains use their **local default currency**. The global `.com` domain uses the **deal's native currency** (what the supplier actually set). This hybrid avoids both problems: localized domains feel native, while `.com` stays authentic for an international audience without arbitrarily picking one currency.

| Domain | Strategy | Currency | Example |
|--------|----------|----------|---------|
| `wholesaleup.co.uk` | Domain default | GBP | `£195/unit` |
| `wholesaleup.de` | Domain default | EUR | `€229/unit` |
| `wholesaleup.fr` | Domain default | EUR | `€229/unit` |
| `wholesaleup.nl` | Domain default | EUR | `€229/unit` |
| `wholesaleup.com` | Deal's native | varies | `€229/unit` (if supplier prices in EUR) |

**Rationale:**
- Country domains: OG cards are marketing touchpoints — a link shared from `wholesaleup.co.uk` on WhatsApp should show `£195/unit`, not `€229/unit`. The sharer and recipient are in the same locale context.
- `.com`: visitors are international — picking any single currency would be wrong for most of them. The native currency is the most accurate and signals which market the supplier operates in.
- This matches how Amazon handles it — `amazon.co.uk` shows GBP, `amazon.de` shows EUR, while `amazon.com` shows the product's native currency (USD for US sellers, etc.)

**Implementation pattern:**

```jsx
// Domain → locale → currency mapping
// currency: null = use deal's native currency (Option 2)
const DOMAIN_LOCALES = {
  "wholesaleup.co.uk": { locale: "en-GB", currency: "GBP", symbol: "£" },
  "wholesaleup.de":    { locale: "de-DE", currency: "EUR", symbol: "€" },
  "wholesaleup.fr":    { locale: "fr-FR", currency: "EUR", symbol: "€" },
  "wholesaleup.nl":    { locale: "nl-NL", currency: "EUR", symbol: "€" },
  "wholesaleup.com":   { locale: "en-US", currency: null,  symbol: null },  // native currency
  // Default fallback — native currency
  "default":           { locale: "en-GB", currency: null,  symbol: null },
};

// In generateMetadata():
const domainConfig = getLocaleFromDomain();
const displayCurrency = domainConfig.currency || deal.currency;   // fallback to native
const displaySymbol = domainConfig.symbol || CURRENCY_SYMBOLS[deal.currency];
const displayPrice = domainConfig.currency
  ? convertPrice(deal.price, deal.currency, domainConfig.currency)  // convert for country domains
  : deal.price;                                                      // native for .com
// → OG description: `${displaySymbol}${displayPrice}/unit | ${margin}% margin | MOQ ${deal.moq}`
```

**Exchange rate source:** Daily feed computed server-side at build/revalidation time. Acceptable staleness: 24h (wholesale prices don't fluctuate intraday). Store rates in a shared config or edge KV store. Only needed for country domains — `.com` skips conversion entirely.

**Edge case — deal priced in same currency as domain:** No conversion needed; use the native price directly. This is the common case for local suppliers (UK supplier on .co.uk = GBP already).

### JSON-LD Multi-Currency Offers — DETERMINED

JSON-LD Product schema includes multiple `Offer` objects so Google shows the most relevant price per searcher locale. This complements the single-currency OG tags:

```json
"offers": [
  { "@type": "Offer", "price": "229.00", "priceCurrency": "EUR", "availability": "https://schema.org/InStock" },
  { "@type": "Offer", "price": "195.00", "priceCurrency": "GBP", "availability": "https://schema.org/InStock" },
  { "@type": "Offer", "price": "248.00", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
]
```

Include the domain's local currency as the first offer (most weight in structured data), plus 2–3 other major currencies. Conversion rates from the same daily feed.

### og:locale per Domain — DETERMINED

Each country domain sets its own `og:locale` in the root layout, with `og:locale:alternate` tags pointing to all other domains for the same content:

| Domain | `og:locale` | Notes |
|--------|------------|-------|
| `wholesaleup.co.uk` | `en_GB` | Current default |
| `wholesaleup.com` | `en_US` | US market |
| `wholesaleup.de` | `de_DE` | German market |
| `wholesaleup.fr` | `fr_FR` | French market |
| `wholesaleup.nl` | `nl_NL` | Dutch market |

Each page also needs `<link rel="alternate" hreflang="en-gb" href="https://wholesaleup.co.uk/deals/..." />` etc. for cross-domain canonicalization so Google doesn't treat country domains as duplicate content.

### Multi-Language OG Descriptions — PENDING
| Decision | Notes | Status |
|----------|-------|--------|
| Translated OG descriptions | E.g. German description on `wholesaleup.de` | PENDING — blocked on i18n / translation pipeline decision. English-only OG descriptions are acceptable at launch for all country domains. |
| Translated OG image text | Dynamic OG images with price overlay in local language | PENDING — same blocker. Price + currency symbols are language-agnostic; only "Verified Supplier" label would need translation. |

---

## 9. Implementation Priority

### Phase 1 — Quick Wins (No backend needed)
1. ~~Add `twitter:site` handle~~ — DONE: `X_HANDLE` constant + `twitter.site` / `twitter.creator` in layout.tsx
2. Add page-specific OG images for homepage and deals listing
3. Add `robots: { index: false }` to `/filters` and `/single-deal`
4. Fix homepage canonical from `/homepage` to `/`
5. Add BreadcrumbList JSON-LD to pages that have breadcrumbs

### Phase 2 — Dynamic Metadata (Requires API routes)
1. Implement `generateMetadata()` for `/deals/[slug]` with deal data
2. Implement `generateMetadata()` for `/suppliers/[slug]` with supplier data
3. Add Product + Offer JSON-LD to deal pages
4. Add AggregateRating JSON-LD to deal pages with reviews

### Phase 3 — Dynamic OG Images (Requires image generation)
1. Design branded OG image template for deals
2. Design branded OG image template for suppliers
3. Implement via Next.js ImageResponse API or pre-render at listing time
4. Set up CDN caching for generated images

### Phase 4 — Rich Results Optimization
1. ItemList schema on listing pages
2. FAQPage schema on pricing/homepage
3. LocalBusiness schema on supplier profiles
4. Review schema on testimonials page

---

## 10. File Reference

| File | Contains |
|------|----------|
| `src/app/layout.tsx` | Root metadata, OG defaults, JSON-LD Organization + WebSite |
| `src/app/homepage/page.tsx` | Homepage metadata + OG |
| `src/app/deals/page.tsx` | Deals listing metadata + OG |
| `src/app/deal/page.tsx` | Static deal metadata + commented `generateMetadata()` stub |
| `src/app/supplier/page.tsx` | Static supplier metadata + commented `generateMetadata()` stub |
| `public/og-default.png` | Default OG image (1200×630) |
| `public/favicon.svg` | Site favicon |
| `public/robots.txt` | Robots directives |

---

## 11. Related Skills

- **`seo`** — Comprehensive SEO standards including meta tag formulas, structured data patterns, Core Web Vitals
- **`deal-page`** — Deal variable schema (source data for dynamic OG tags)
- **`supplier-profile`** — Supplier data model (source data for supplier OG tags)
- **`production-standards`** — API routes and deployment requirements for dynamic metadata
