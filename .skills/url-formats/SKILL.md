---
name: url-formats
description: |
  **WholesaleUp URL Formats, Slug Conventions & Query Parameters**: Single source of truth for all route patterns, slug generation rules, query parameter naming, internal link formats, and outbound redirect conventions used across the WholesaleUp Next.js app. Reference this skill whenever building links, creating new routes, generating slugs, adding query params, or connecting pages together. Prevents common bugs like mismatched param names, broken slug transforms, or links that silently fail. MANDATORY TRIGGERS: URL, slug, route, href, link, query param, searchParams, /go, redirect, encodeURIComponent, category route, deals route, suppliers route, breadcrumb link, navigate, router.push, router.replace, pagination, filter URL, search URL, keyword param
---

# WholesaleUp URL Formats & Slug Conventions

Single source of truth for every route, slug pattern, query parameter, and link convention in the WholesaleUp frontend. Reference this whenever building links between pages, adding query params to filter URLs, or creating new routes.

## Route Structure

### Public Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Redirects to `/homepage` | |
| `/homepage` | Marketing homepage | |
| `/deals` | All deals (paginated, filterable) | |
| `/deals/[category]` | Deals by L1 category | Static generation via `generateStaticParams()` |
| `/deals/[category]/[subcategory]` | Deals by L2 subcategory | Static generation via `generateStaticParams()` |
| `/deals/dropshipping` | Dropshipping deals landing page | SEO landing page — static route takes priority over `[category]` dynamic segment |
| `/suppliers` | All suppliers (paginated, filterable) | |
| `/suppliers/[category]` | Suppliers by L1 category | |
| `/suppliers/[category]/[subcategory]` | Suppliers by L2 subcategory | |
| `/suppliers/manufacturers` | Manufacturers landing page | SEO landing page — static route takes priority over `[slug]` dynamic segment |
| `/suppliers/wholesalers` | Wholesalers landing page | SEO landing page — static route takes priority over `[slug]` dynamic segment |
| `/suppliers/dropshippers` | Dropshippers landing page | SEO landing page — static route takes priority over `[slug]` dynamic segment |
| `/supplier` | Single supplier profile (demo) | Will become `/suppliers/[slug]` in production |
| `/deal` | Single deal detail (demo) | Will become `/deals/[slug]` in production |
| `/pricing` | Pricing plans | |
| `/register` | Registration & login | Uses `#login` hash for login tab |
| `/contact` | Contact & support | |
| `/privacy` | Privacy policy | |
| `/terms` | Terms of service | |
| `/cookies` | Cookie policy | |
| `/maintenance` | Under maintenance page | Bypasses AppLayout entirely (no header/footer/sidebar) |

> **PRODUCTION NOTE — Route Conflicts:** `/deals/dropshipping` and `/suppliers/manufacturers|wholesalers|dropshippers` are static routes that sit at the same path level as `[category]` and `[slug]` dynamic segments. In Next.js App Router, static routes take priority over dynamic ones, so no conflict occurs. However, ensure these exact slugs (`dropshipping`, `manufacturers`, `wholesalers`, `dropshippers`) are never used as category IDs or supplier profile slugs. Add validation in the supplier slug generation pipeline to reject these reserved words.

### Dashboard Pages (Authenticated)

| Route | Page |
|---|---|
| `/dashboard` | Main dashboard |
| `/dashboard/account-profile` | User account settings |
| `/dashboard/buyer-profile` | Buyer profile setup |
| `/dashboard/supplier-profile` | Supplier profile management |
| `/dashboard/add-deal` | Create new deal listing |
| `/dashboard/newsletters` | Newsletter subscriptions |

### Placeholder Routes (Referenced but Not Yet Implemented)

These routes are linked from the footer/nav but don't have route files yet:

| Route | Intended Page |
|---|---|
| `/help` | Help centre |
| `/a-z` | A-Z supplier/brand index (also used for sitemap submission of high-value keyword URLs) |
| `/benefits` | Retailer benefits |
| `/supplier-benefits` | Supplier benefits |
| `/get-listed` | Get listed as supplier |

### Outbound Redirect

| Route | Purpose |
|---|---|
| `/go?url=...&type=website` | Tracked supplier website click (500/mo limit) |
| `/go?url=...&type=social` | Tracked social media link (no limit) |

The `/go` route handler is not yet implemented. See the `website-click-limits` skill for the full specification.

## Category Slugs (Canonical)

Category and subcategory slugs are **pre-defined constants** in `/lib/categories.js`. They are NOT generated dynamically — they're the canonical IDs in `CATEGORY_TREE`.

**Format rules:**
- All lowercase
- Hyphens separate words
- Ampersands become `-` (e.g. "Health & Beauty" → `health-beauty`)
- No `encodeURIComponent` needed — they contain only `[a-z0-9-]`

**13 L1 categories:**
`clothing-fashion`, `health-beauty`, `home-garden`, `electronics-technology`, `toys-games`, `gifts-seasonal`, `sports-outdoors`, `jewellery-watches`, `food-beverages`, `pet-supplies`, `baby-kids`, `surplus-clearance`, `automotive-parts`

**~101 L2 subcategories** follow the same convention: `mens-clothing`, `smartphones-tablets`, `gym-fitness-equipment`, etc.

**Internal composite ID format** (used in filter state only, never in URLs):
`{category}--{subcategory}` (double dash separator)
Example: `clothing-fashion--mens-clothing`

**Lookup functions:**
- `getCategoryById(id)` — returns L1 category object or `undefined`
- `getSubcategoryById(id)` — returns L2 subcategory object or `undefined`

Category links always use the canonical ID directly — no slug transform needed:
```jsx
// Correct — use the canonical ID from CATEGORY_TREE
<a href={`/deals/${category.id}`}>
<a href={`/suppliers/${category.id}/${sub.id}`}>

// Wrong — never slugify a category name, use the pre-defined ID
<a href={`/deals/${category.name.toLowerCase().replace(...)}`}>
```

## Query Parameter Conventions

### Keyword Search Parameters

Both `/deals` and `/suppliers` use the same keyword param system. The navbar search also uses `?any=`.

| Param | Mode | Example | Behaviour |
|---|---|---|---|
| `any` | OR match | `?any=nike,adidas` | Shows results matching ANY term |
| `all` | AND match | `?all=dark,blue` | Shows results matching ALL terms |
| `exact` | Phrase match | `?exact=dark+blue` | Shows results matching exact phrase |
| `keywords` | Legacy (→ `any`) | `?keywords=nike` | Backwards compat, treated as `any` mode |

**Multiple modes can combine:** `?any=nike,adidas&exact=running+shoes&all=mens,2024`

When linking from product labels, brand pills, tags, or navbar search to a search results page, always use `?any=`:
```jsx
// Correct
<a href={`/deals?any=${encodeURIComponent(brand)}`}>
<a href={`/suppliers?any=${encodeURIComponent(term)}`}>

// Wrong — "keyword" (singular) is not read by the parser
<a href={`/deals?keyword=${encodeURIComponent(brand)}`}>

// Wrong — "keywords" works but is deprecated legacy
<a href={`/deals?keywords=${encodeURIComponent(brand)}`}>

// Wrong — ?q= is not used in our URL structure
<a href={`/deals?q=${encodeURIComponent(term)}`}>
```

### Filter Parameters (Complete Reference)

| Param | Format | Used on | Example |
|---|---|---|---|
| `countries` | comma-separated lowercase ISO alpha-2 | `/deals`, `/suppliers` | `?countries=gb,de,us` |
| `grades` | comma-separated lowercase | `/deals`, `/suppliers` | `?grades=new,used` |
| `priceMin` | numeric string | `/deals`, `/suppliers` | `?priceMin=10.50` |
| `priceMax` | numeric string | `/deals`, `/suppliers` | `?priceMax=100` |
| `buyerTypes` | comma-separated lowercase slugified | `/deals`, `/suppliers` | `?buyerTypes=online-retailer,dropshipper` |
| `supplierTypes` | comma-separated lowercase slugified | `/suppliers` only | `?supplierTypes=manufacturers,wholesalers` (multi only — single type uses path segment) |
| `dropshipping` | path segment on `/deals` | `/deals` only | `/deals/dropshipping` (path segment, NOT `?dropshipping=true`) |
| `sort` | enum string | `/deals` only | `?sort=latest` |
| `page` | positive integer | `/deals`, `/suppliers` | `?page=2` (omitted = page 1) |

**Buyer type values:** Use lowercase hyphenated slugs matching the canonical `BUYER_TYPES` array in `filters.jsx`: `shop-retailer`, `online-retailer`, `marketplace-seller`, `dropshipper`, `wholesaler-reseller`, `multi-chain`, `market-trader`, `catalogue-retailer`, `buying-group`, `government-institution`, `ngo-charity`, `hospitality-horeca`, `salon-spa-clinic`, `gym-fitness`, `trade-professional`, `educational-institution`, `other`. Deals and suppliers with no `buyerTypesServed` data are treated as serving ALL buyer types (they pass through the filter).

**Country codes:** Always lowercase ISO alpha-2 (`gb`, `de`, `us`), never legacy uppercase (`UK`, `DE`, `US`). A `LEGACY_TO_ISO` mapping exists in deal-cards.jsx for bridging old data.

**Supplier type values:** Use lowercase slugified plural forms: `manufacturers`, `wholesalers`, `dropshippers`, `liquidators`, etc. Never title-case display labels in URLs.

**Single supplier type → path segment:** When exactly ONE supplier type is selected, use a path segment instead of a query param: `/suppliers/liquidators`, `/suppliers/manufacturers`. Only use `?supplierTypes=` when MULTIPLE types are selected: `/suppliers?supplierTypes=liquidators,manufacturers`.

**Grades values:** Lowercase: `new`, `used`, `refurbished`, `grade-a`, `grade-b`, etc.

**Sort values:** `best-match` (default — omitted from URL), `date-asc`, `date-desc`, `markup-asc`, `markup-desc`, `price-asc`, `price-desc`, `moq-asc`, `moq-desc`, `profit-asc`, `profit-desc`, `rrp-asc`, `rrp-desc`, `discount-asc`, `discount-desc`, `units-asc`, `units-desc`. Sort pages should have `rel=canonical` pointing to the unsorted version to avoid duplicate indexing.

**Pagination:** `?page=2`, `?page=3`, etc. Page 1 is the default (omit `?page=1`). Page 1 should have `rel=canonical` pointing to itself (the unparameterised version).

### Auth Parameters

| URL | Purpose |
|---|---|
| `/register` | Registration (default view) |
| `/register#login` | Login tab via hash fragment |
| `/register?type=retailer` | Pre-select buyer signup flow |
| `/register?type=supplier` | Pre-select supplier signup flow |

## SEO: Indexing & Canonical Rules

### What Gets Indexed

| URL type | Indexed? | Canonical | Notes |
|---|---|---|---|
| `/deals` | Yes | Self | Base deals page |
| `/deals/clothing-fashion` | Yes | Self | Category pages are primary SEO targets |
| `/deals/clothing-fashion/mens-clothing` | Yes | Self | Subcategory pages are primary SEO targets |
| `/deals/dropshipping` | Yes | Self | Dedicated SEO landing page |
| `/suppliers/manufacturers` | Yes | Self | Dedicated SEO landing page |
| `/deals?any=nike` | Yes | Self | Keyword pages show unique content — indexable |
| `/deals?any=nike&exact=dark+blue` | Yes | Self | Combined keyword pages — indexable if content differs |
| `/deals/clothing-fashion?countries=gb` | Yes | Self | Country-filtered category pages show unique content |
| `/deals?sort=price-asc` | Yes | → `/deals` | Sort only changes order, not content — canonical to unsorted |
| `/deals?page=2` | Yes | → `/deals` | Pagination — canonical to page 1 |
| `/deals/clothing-fashion?sort=latest&page=3` | Yes | → `/deals/clothing-fashion` | Combined sort+page — canonical to base |

### Key Principles

1. **Categories as directories** — these are the primary SEO taxonomy, crawlable via sitemaps and navigation
2. **Keywords are indexable** — `?any=nike` returns unique content (only Nike deals), so it's a valuable page for search engines. Google crawls and indexes query param URLs.
3. **High-value keyword URLs go in the sitemap** — the `/a-z` index pages list top brands and popular keywords, giving Google discovery paths to keyword URLs
4. **Sort and pagination get canonical treatment** — they don't change the content set, only the presentation, so canonical back to the base page
5. **Filter combinations are indexable when content differs** — `/deals/clothing-fashion?countries=gb` shows genuinely different deals than `/deals/clothing-fashion`, so it should be its own indexable page

### Dedicated Landing Pages (SEO)

These static routes exist alongside the dynamic filter system. They serve as SEO entry points for high-value search terms:

| Landing page | Targets | Filter equivalent |
|---|---|---|
| `/deals/dropshipping` | "dropshipping deals UK", "wholesale dropshipping" | Same as single-filter path segment |
| `/suppliers/manufacturers` | "wholesale manufacturers UK", "UK manufacturers" | Same as single-type path segment |
| `/suppliers/wholesalers` | "UK wholesalers", "wholesale suppliers" | Same as single-type path segment |
| `/suppliers/dropshippers` | "dropshipping suppliers UK" | Same as single-type path segment |
| `/suppliers/liquidators` | "liquidation stock UK", "UK liquidators" | Same as single-type path segment |

These pages should have unique meta titles, descriptions, and potentially curated content (intro text, FAQs) beyond what the filter-only version shows. This is what makes them worth having as separate routes rather than just relying on the query param version.

> **RESERVED SLUGS:** The following slugs are reserved for landing pages and must never be used as category IDs, subcategory IDs, or supplier profile slugs: `dropshipping`, `manufacturers`, `wholesalers`, `dropshippers`, `liquidators`. Add server-side validation to reject these when generating supplier slugs.

## Dynamic Page Headings

Page `<h1>` headings reflect active filters. This improves SEO and user orientation.

### `/suppliers` heading pattern

`{keywords} {category} {supplierType(s) | "Wholesale Suppliers"} from {countries}`

| Active filters | Heading |
|---|---|
| None | Wholesale Suppliers |
| Category: Mens Clothing | Mens Clothing Wholesale Suppliers |
| Category + 1 type | Mens Clothing Liquidators |
| Category + 2 types | Mens Clothing Liquidators and Importers |
| Category + country | Mens Clothing Wholesale Suppliers from United Kingdom |
| Category + type + 4 countries | Mens Clothing Liquidators from United Kingdom, Germany, France +1 more |

### `/deals` heading pattern

`{keywords} {category} {Dropship | Wholesale} Deals from {countries}`

| Active filters | Heading |
|---|---|
| None | Wholesale Deals |
| Dropshipping only | Dropship Deals |
| Category + dropshipping | Mens Clothing Dropship Deals |
| Category + country | Mens Clothing Wholesale Deals from United Kingdom |

### Country display rules

- 1-3 countries: list all names joined with "and" (`from United Kingdom, Germany and France`)
- 4+ countries: first 3 names + count (`from United Kingdom, Germany, France +2 more`)
- Country names resolved from ISO alpha-2 codes via `COUNTRIES` array in `/lib/countries.js`

## URL Sync Behaviour

- **Category/subcategory** changes use path segments and `router.push()` (creates browser history entry)
- **Filter/keyword/page** changes use query params and `router.replace()` (no history clutter — user can't "back" through 50 filter changes)
- Filters are serialised to URL on every change so the URL is always shareable/bookmarkable

## Outbound Links (`/go` Redirect)

All outbound supplier website links route through `/go` for click tracking:

```jsx
// Use the WebsiteLink component (handles click limits automatically)
import WebsiteLink from "@/components/shared/website-link";

<WebsiteLink url={supplier.companyWebsite} dealSlug={deal?.slug}>
  Visit Website <ExternalLink size={11} />
</WebsiteLink>
```

The `WebsiteLink` component constructs the URL as:
```
/go?url={encodeURIComponent(url)}&deal={encodeURIComponent(slug)}&type=website
```

Social links (LinkedIn, etc.) use `&type=social` and are NOT subject to the 500/mo click limit.

## Ad-Hoc Slug Transforms (Non-Category Terms)

For non-category terms (brands, tags, product groups) that need to become URL segments, use this pattern:

```javascript
term.toLowerCase().replace(/\s+&\s+/g, "-and-").replace(/\s+/g, "-")
```

This produces: "Nike & Adidas Shoes" → `nike-and-adidas-shoes`

**However**, when linking non-category terms to search pages, prefer query params over slug segments:
```jsx
// Preferred — uses the keyword search system, always works
<a href={`/deals?any=${encodeURIComponent("Nike & Adidas")}`}>

// Avoid — generates a slug that hits the [category] route and may 404
<a href={`/deals/${slugify("Nike & Adidas")}`}>
```

The slug-as-path approach only works if the slug matches a known category ID or a reserved landing page slug. For everything else (brands, tags, product names, supplier names), use `?any=` query params.

## Known Technical Debt

### 1. Country Code Normalisation

- Filter state uses lowercase ISO alpha-2: `gb`, `de`, `us`
- Some demo data uses uppercase legacy codes: `UK`, `DE`, `US`
- A `LEGACY_TO_ISO` mapping exists in deal-cards.jsx for bridging

**Resolution:** Normalise all data to lowercase ISO alpha-2 at the data layer.

### 2. Shared `slugify()` Utility

The codebase previously had three different ad-hoc slug transforms. Most have been replaced with `?any=` keyword search. If slug transforms are still needed for new features, create a shared `slugify()` utility in `/lib/utils.js` using the canonical pattern above.

## Quick Reference: "I want to link to..."

| Destination | URL Format |
|---|---|
| All deals | `/deals` |
| Deals in a category | `/deals/{category-id}` |
| Deals in a subcategory | `/deals/{category-id}/{subcategory-id}` |
| Deals matching a keyword | `/deals?any={encodeURIComponent(term)}` |
| Deals matching a brand | `/deals?any={encodeURIComponent(brand)}` |
| Deals filtered by country | `/deals?countries=gb,de` |
| Deals filtered by grade | `/deals?grades=new,used` |
| Deals filtered by price | `/deals?priceMin=50&priceMax=500` |
| Deals filtered by buyer type | `/deals?buyerTypes=online-retailer,dropshipper` |
| Dropshipping deals | `/deals/dropshipping` (path segment, not query param) |
| All suppliers | `/suppliers` |
| Suppliers in a category | `/suppliers/{category-id}` |
| Suppliers matching a keyword | `/suppliers?any={encodeURIComponent(term)}` |
| Suppliers by single type | `/suppliers/manufacturers` or `/suppliers/wholesalers` or `/suppliers/dropshippers` or `/suppliers/liquidators` |
| Suppliers by multiple types | `/suppliers?supplierTypes=manufacturers,wholesalers` |
| Suppliers filtered by country | `/suppliers?countries=gb,ie` |
| Suppliers filtered by buyer type | `/suppliers?buyerTypes=shop-retailer,multi-chain` |
| Supplier website (tracked) | Use `<WebsiteLink url={...}>` component |
| Pricing page | `/pricing` |
| Register (buyer) | `/register?type=retailer` |
| Register (supplier) | `/register?type=supplier` |
| Login | `/register#login` |

## Combined URL Examples

```
/deals/clothing-fashion/mens-clothing?countries=gb&grades=new&buyerTypes=online-retailer&priceMin=10&priceMax=200&sort=date-desc&page=2
/suppliers/manufacturers?any=nike&countries=gb,de&buyerTypes=shop-retailer,multi-chain&page=3
/suppliers?any=nike&countries=gb,de&supplierTypes=manufacturers,wholesalers&page=3
/deals?any=samsung&exact=galaxy+s24&all=unlocked,new&countries=gb&buyerTypes=marketplace-seller&priceMax=500
```
