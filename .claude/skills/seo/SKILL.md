---
name: seo
description: |
  **SEO Best Practices Reference**: Comprehensive SEO standards for Next.js 15 / React 19 web development. Reference this skill whenever building pages, creating URLs, writing meta tags, adding images, structuring headings, implementing structured data, or doing anything that affects search engine visibility. Includes competitor benchmark strategy against merkandi.com and alibaba.com with tactics for outranking them through superior on-page SEO.
  MANDATORY TRIGGERS: SEO, URL structure, meta tags, Open Graph, schema markup, structured data, sitemap, robots.txt, canonical, hreflang, alt text, page speed, Core Web Vitals, search engine, rich results, slug, keyword, crawl, index, competitor, outrank, Merkandi, Alibaba, SERP, ranking
---

# SEO Best Practices — Next.js 15 / React 19

This skill provides actionable SEO standards for the WholesaleUp project. Reference it whenever creating or modifying pages, URLs, components, or content that affects search visibility.

---

## 1. URL Structure

### Path Rules
- **Always use lowercase hyphens** as word separators: `/wholesale-suppliers` not `/wholesale_suppliers` or `/wholesaleSuppliers`
- Keep URLs short, descriptive, and keyword-rich: `/deals/calvin-klein-jeans` not `/deals/item?id=42`
- Avoid trailing slashes inconsistency — pick one pattern and stick to it
- Never expose implementation details: no `.html`, `.php`, no `/api/` in user-facing URLs
- Avoid deep nesting beyond 3 levels: `/category/subcategory/product` is the max

### Query Parameters
- Query params (`?q=`, `?sort=`, `?page=`) are fine for filters, search, and pagination — Google handles them well
- Use `+` or `%20` for spaces in query values (both are standard, `+` is more readable)
- For SEO-critical filtered views, prefer path segments: `/deals/clothing` over `/deals?category=clothing`
- Add `rel="canonical"` to filtered/sorted pages pointing to the unfiltered version

### Slugs
- Generate from the item title: `"Calvin Klein Jeans Shorts"` → `calvin-klein-jeans-shorts`
- Strip special characters, collapse multiple hyphens
- For duplicate slugs, append a short unique suffix: `calvin-klein-jeans-shorts-2`

```js
// Slug generator (for deal/product titles)
function toSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // remove special chars
    .replace(/[\s_]+/g, '-')      // spaces/underscores → hyphens
    .replace(/-+/g, '-')          // collapse multiple hyphens
    .replace(/^-|-$/g, '');       // trim leading/trailing hyphens
}
```

### Category Slug Standard

**Single source of truth:** `CATEGORY_TREE` in `src/lib/categories.js`. Every category slug sitewide MUST use the canonical `id` values from this file. No runtime slug generation from display names.

**Format:** `{l1-id}/{l2-id}` — e.g. `clothing-fashion/mens-clothing`

**Key rules:**
- Apostrophes in display names are **dropped**, not converted to hyphens: "Men's Clothing" → `mens-clothing` (NOT `men-s-clothing`)
- All IDs are pre-defined in `CATEGORY_TREE` — never generate category slugs at runtime
- The `CATEGORY_TREE[].id` (L1) and `CATEGORY_TREE[].subs[].id` (L2) are the canonical identifiers
- These IDs are used in: URLs, breadcrumbs, form values, `CATEGORY_FIELD_MAP` keys, API responses, filters, and header navigation
- `PRODUCT_CATEGORY_TREE` (derived from `CATEGORY_TREE`) maps to `{name, subs: [label strings]}` for display purposes only — never use it for slug generation

**Why not runtime slug generation?** A naive `slug()` function that strips special characters converts "Men's Clothing" → `men-s-clothing` (the apostrophe becomes a hyphen). This creates inconsistency with canonical IDs (`mens-clothing`) used in routes, headers, and APIs. The fix: always use pre-defined IDs, never generate slugs from display names for categories.

**Canonical examples:**
| Display Name | Canonical Slug (correct) | Runtime slug (WRONG) |
|---|---|---|
| Men's Clothing | `mens-clothing` | `men-s-clothing` |
| Women's Clothing | `womens-clothing` | `women-s-clothing` |
| Children's Clothing | `childrens-clothing` | `children-s-clothing` |
| Men's Grooming | `mens-grooming` | `men-s-grooming` |

---

## 2. Meta Tags & Open Graph

### Essential Meta Tags (per page)

```jsx
// Next.js 15 App Router — layout.js or page.js
export const metadata = {
  title: 'Wholesale Deals on Electronics | WholesaleUp',
  description: 'Browse 4,691 verified wholesale deals on electronics. Buy direct from trusted suppliers at up to 95% below retail.',
  alternates: {
    canonical: 'https://wholesaleup.com/deals/electronics',
  },
  openGraph: {
    title: 'Wholesale Electronics Deals | WholesaleUp',
    description: 'Browse 4,691 verified wholesale deals on electronics.',
    url: 'https://wholesaleup.com/deals/electronics',
    siteName: 'WholesaleUp',
    images: [{ url: '/og/electronics.jpg', width: 1200, height: 630, alt: 'Wholesale electronics deals' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wholesale Electronics Deals | WholesaleUp',
    description: 'Browse 4,691 verified wholesale deals on electronics.',
    images: ['/og/electronics.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};
```

### Dynamic Metadata

```jsx
// For pages with dynamic data (e.g., /deals/[slug])
export async function generateMetadata({ params }) {
  const deal = await getDeal(params.slug);
  return {
    title: `${deal.name} — Wholesale Deal | WholesaleUp`,
    description: `Buy ${deal.name} wholesale from ${deal.supplier}. ${deal.currency}${deal.price} per unit ex.VAT.`,
    alternates: { canonical: `https://wholesaleup.com/deals/${params.slug}` },
    openGraph: {
      title: deal.name,
      images: [{ url: deal.image, width: 800, height: 600, alt: deal.name }],
    },
  };
}
```

### Title Tag Formula
- **Homepage**: `Brand — Value Proposition` → `WholesaleUp — Verified Wholesale & Dropship Deals`
- **Category**: `Category Deals | Brand` → `Wholesale Electronics Deals | WholesaleUp`
- **Product**: `Product Name — Deal Type | Brand` → `Calvin Klein Jeans Shorts — Wholesale Deal | WholesaleUp`
- **Info page**: `Page Title | Brand` → `Pricing Plans | WholesaleUp`
- Keep titles under 60 characters, descriptions under 155 characters

---

## 3. Heading Hierarchy & HTML Semantics

### Rules
- Every page gets exactly **one `<h1>`** — it should contain the primary keyword
- Headings follow strict hierarchy: h1 → h2 → h3 (never skip levels)
- Use semantic HTML elements: `<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`
- Don't use headings for styling — use CSS classes instead
- Add `aria-label` to repeated `<nav>` elements to distinguish them

### Example Structure
```
<h1>Wholesale Deals</h1>                    ← page title, one per page
  <h2>Trending Deals</h2>                   ← major section
  <h2>Latest Deals</h2>                     ← major section
    <h3>Calvin Klein Jeans Shorts</h3>       ← item within section
    <h3>Nike Air Max Sneakers</h3>           ← item within section
  <h2>Browse by Category</h2>               ← major section
```

---

## 4. Image SEO

### Rules
- **Always provide descriptive `alt` text**: `alt="Calvin Klein men's slim fit jeans in dark blue"` not `alt="product image"` or `alt=""`
- Use `loading="lazy"` for below-the-fold images, `loading="eager"` or `priority` for hero/LCP images
- Prefer modern formats: WebP (90%+ browser support) with JPEG fallback
- Use Next.js `<Image>` component — it handles srcset, lazy loading, and format conversion automatically
- Name image files descriptively: `calvin-klein-jeans-shorts.webp` not `IMG_4521.jpg`
- Include `width` and `height` attributes to prevent CLS (layout shift)

```jsx
import Image from 'next/image';

<Image
  src="/products/calvin-klein-jeans-shorts.webp"
  alt="Calvin Klein men's slim fit jeans shorts in dark wash denim"
  width={400}
  height={400}
  priority={isAboveFold}  // true for hero images
/>
```

---

## 5. Structured Data (JSON-LD)

### E-Commerce Product Schema

```jsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Calvin Klein Jeans Shorts",
  "description": "Wholesale Calvin Klein men's jeans shorts, available in bulk.",
  "image": "https://wholesaleup.com/products/calvin-klein-jeans-shorts.webp",
  "brand": { "@type": "Brand", "name": "Calvin Klein" },
  "offers": {
    "@type": "Offer",
    "price": "48.05",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "WholesaleUp" },
    "priceValidUntil": "2026-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "127"
  }
}) }} />
```

### Organization Schema (site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WholesaleUp",
  "url": "https://wholesaleup.com",
  "logo": "https://wholesaleup.com/logo.svg",
  "sameAs": ["https://twitter.com/wholesaleup", "https://linkedin.com/company/wholesaleup"],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "service@wholesaleup.com",
    "contactType": "customer service"
  }
}
```

### Breadcrumb Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wholesaleup.com" },
    { "@type": "ListItem", "position": 2, "name": "Deals", "item": "https://wholesaleup.com/deals" },
    { "@type": "ListItem", "position": 3, "name": "Electronics", "item": "https://wholesaleup.com/deals/electronics" }
  ]
}
```

### FAQ Schema (for pricing/help pages)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I register as a retailer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Click Join Free, fill in your business details, and get instant access to wholesale deals."
      }
    }
  ]
}
```

---

## 6. Core Web Vitals

### Targets (2025-2026)
| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### Optimization Strategies
- **LCP**: Preload hero image, use `priority` on Next.js Image, inline critical CSS, use server components
- **INP**: Debounce event handlers, use `useTransition` for non-urgent updates, avoid layout thrashing
- **CLS**: Always set `width`/`height` on images, use `min-height` on dynamic containers, avoid injecting content above existing content

---

## 7. Next.js 15 Specific

### robots.ts
```ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard/', '/account-profile/'] },
    ],
    sitemap: 'https://wholesaleup.com/sitemap.xml',
  };
}
```

### sitemap.ts
```ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deals = await getAllDeals();
  const dealUrls = deals.map((deal) => ({
    url: `https://wholesaleup.com/deals/${deal.slug}`,
    lastModified: deal.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://wholesaleup.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://wholesaleup.com/deals', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://wholesaleup.com/suppliers', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://wholesaleup.com/pricing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...dealUrls,
  ];
}
```

### Server Components for SEO
- Use React Server Components (default in App Router) for SEO-critical content — they render on the server and deliver full HTML to crawlers
- Only use `"use client"` for interactive elements (dropdowns, modals, search)
- Avoid client-side-only data fetching for content that needs to be indexed

---

## 8. Internal Linking

### Rules
- Use descriptive anchor text: `<a href="/deals/electronics">wholesale electronics deals</a>` not `<a href="/deals/electronics">click here</a>`
- Link contextually from content — don't cluster all links in one spot
- Every important page should be reachable within 3 clicks from the homepage
- Use breadcrumbs on all pages below the homepage level
- Cross-link related content: deal pages → supplier profile, supplier profile → their deals

---

## 9. Accessibility = SEO

Google increasingly uses accessibility signals as ranking factors. WCAG compliance directly improves SEO:

- **All interactive elements need `aria-label`** when no visible text label exists
- **All images need descriptive `alt` text** (also helps image search rankings)
- **Heading hierarchy must be logical** (h1 → h2 → h3, no skipping)
- **Color contrast ratios**: minimum 4.5:1 for body text, 3:1 for large text
- **Keyboard navigation**: all interactive elements must be keyboard-accessible
- **Focus indicators**: visible focus rings on interactive elements
- **Skip links**: "Skip to main content" link for screen reader users

---

## 10. E-Commerce Specific

### Product Listing Pages
- Include item count in title: `"4,691 Wholesale Deals | WholesaleUp"`
- Use pagination with `rel="next"` / `rel="prev"` (or load-more with proper URL updates)
- Make filtered URLs crawlable when they represent important categories
- Add `noindex` to low-value filter combinations (e.g., `?sort=price&color=blue&size=xl`)

### Product Detail Pages
- Product schema with price, availability, brand, and reviews
- High-quality images with descriptive alt text and zoom capability
- Breadcrumb navigation with schema markup
- Related products section for internal linking
- User reviews (fresh content signals)

---

## 11. Competitor Benchmark & Outranking Strategy

WholesaleUp's primary SEO competitors are **merkandi.com** and **alibaba.com**. The objective is to outrank them through superior on-page SEO. Off-page SEO (backlinks, social signals, PR) is handled separately, but every on-page decision should make off-page efforts more effective — pages that are well-structured, fast, and rich in schema markup naturally attract more links and shares.

### Why these competitors are beatable on-page

Both Merkandi and Alibaba have scale, but their on-page SEO has exploitable weaknesses. Merkandi's product pages tend to be thin on structured data and have inconsistent heading hierarchies. Alibaba's pages are heavy, JavaScript-dependent, and often slow on Core Web Vitals — their LCP scores regularly fall in the "needs improvement" range. WholesaleUp can win by being leaner, faster, and more semantically rich on every page.

### Tactical approach

When building or modifying any page, consider what Merkandi and Alibaba would show for the same intent, then ensure WholesaleUp's page is better in these concrete ways:

**Content depth and keyword coverage**: Product and category pages should include wholesale-specific terms that these competitors rank for — "wholesale," "bulk buy," "trade price," "dropship," "supplier," "ex-VAT," "MOQ," "pallet deals." Don't keyword-stuff; weave them naturally into descriptions, headings, alt text, and structured data. Cover long-tail variants that Alibaba's generic product pages miss, like "wholesale Calvin Klein jeans UK supplier."

**Richer structured data**: Go beyond basic Product schema. Add FAQ schema on category pages (common buyer questions), AggregateOffer for category-level pricing ranges, Review/Rating markup on supplier profiles, and BreadcrumbList on every page. The more rich result real estate WholesaleUp claims in SERPs, the fewer clicks flow to competitors.

**Faster Core Web Vitals**: Target all-green CWV scores (LCP < 2.5s, INP < 200ms, CLS < 0.1). Alibaba consistently struggles here. A faster site gets a ranking boost and better user signals (lower bounce rate, longer dwell time), which compounds over time.

**Better title tags and meta descriptions**: Write titles and descriptions that are more specific and compelling than generic competitor equivalents. Include concrete numbers ("4,691 verified deals"), trust signals ("verified suppliers"), and clear value props ("up to 95% below retail"). These improve CTR from SERPs, which is an indirect ranking signal.

**Internal linking that builds topical authority**: Create a tight internal link mesh between deal pages, category pages, supplier profiles, and informational content. This helps Google understand WholesaleUp as the topical authority for wholesale/trade deals — a stronger signal than the fragmented link structures on Merkandi and Alibaba's sprawling sites.

**Supporting off-page SEO from on-page foundations**: Every page should be designed to be link-worthy and share-worthy. That means compelling OG images, clear OG titles/descriptions for social sharing, and content that external sites would want to reference. Category pages with unique market data ("average wholesale price for electronics: £X") or supplier count stats give bloggers and journalists something concrete to link to.

---

## 12. Quick Reference Checklist

For every new page or component, verify:

- [ ] URL uses lowercase hyphens, is short and descriptive
- [ ] Has unique `<title>` tag under 60 characters with primary keyword
- [ ] Has unique `<meta description>` under 155 characters
- [ ] Has exactly one `<h1>` with primary keyword
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] All images have descriptive `alt` text
- [ ] Hero/LCP images use `priority` loading
- [ ] Below-fold images use `loading="lazy"`
- [ ] Open Graph and Twitter Card meta tags are set
- [ ] Canonical URL is set
- [ ] Structured data (JSON-LD) added where applicable
- [ ] Internal links use descriptive anchor text
- [ ] Interactive elements have `aria-label` attributes
- [ ] Page renders meaningful content server-side (not client-only)
